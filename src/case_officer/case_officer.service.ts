import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

import { CaseOfficerEntity } from './case_officer.entity';
import { CaseReportEntity } from './case_report.entity';
import { Admin } from '../admin/admin.entity';

import { CreateCaseOfficerDto } from './dto/create-case-officer.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CreateNoteDto } from './dto/note.dto';
import { UpdateValueDto } from './dto/update-value.dto';

@Injectable()
export class CaseOfficerService {
  constructor(
    @InjectRepository(CaseOfficerEntity)
    private readonly officerRepo: Repository<CaseOfficerEntity>,

    @InjectRepository(CaseReportEntity)
    private readonly caseRepo: Repository<CaseReportEntity>,

    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,

    private readonly mailerService: MailerService,
  ) {}

  // 1. Officer Registration with BCrypt & Mailer
  async registerOfficer(
    dto: CreateCaseOfficerDto,
    filename?: string,
  ): Promise<CaseOfficerEntity> {
    const existing = await this.officerRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Case Officer with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newOfficer = this.officerRepo.create({
      ...dto,
      password: hashedPassword,
      file: filename || null,
    });

    const savedOfficer = await this.officerRepo.save(newOfficer);

    // Send welcome email via MailerService
    try {
      await this.mailerService.sendMail({
        to: savedOfficer.email,
        subject: 'Welcome to Missing Person Reporting System',
        text: `Hello ${savedOfficer.name},\n\nYour Case Officer account has been successfully registered. Your Unique ID is ${savedOfficer.uniqueId}.\n\nThank you.`,
      });
    } catch (err) {
      console.warn('Failed to send registration email:', err.message);
    }

    return savedOfficer;
  }

  // 2. Find All Officers
  async getRegisteredOfficers(country?: string): Promise<CaseOfficerEntity[]> {
    if (country) {
      return this.officerRepo.find({
        where: { country: Like(`%${country}%`) },
        relations: ['cases', 'admins'],
      });
    }
    return this.officerRepo.find({
      relations: ['cases', 'admins'],
    });
  }

  // 3. Find Single Officer by ID
  async findOneOfficer(id: number): Promise<CaseOfficerEntity> {
    const officer = await this.officerRepo.findOne({
      where: { id },
      relations: ['cases', 'admins'],
    });
    if (!officer) {
      throw new NotFoundException(`Case Officer with ID ${id} not found`);
    }
    return officer;
  }

  // 4. Update Officer Country
  async updateCountry(id: number, country: string): Promise<CaseOfficerEntity> {
    const officer = await this.findOneOfficer(id);
    officer.country = country;
    return this.officerRepo.save(officer);
  }

  // 5. Query Officers by Joining Date
  async findByJoiningDate(date: string): Promise<CaseOfficerEntity[]> {
    return this.officerRepo
      .createQueryBuilder('officer')
      .leftJoinAndSelect('officer.cases', 'cases')
      .leftJoinAndSelect('officer.admins', 'admins')
      .where('DATE(officer.joiningDate) = :date', { date })
      .getMany();
  }

  // 6. Query Officers with Default Country
  async findWithDefaultCountry(): Promise<CaseOfficerEntity[]> {
    return this.officerRepo.find({
      where: { country: 'Unknown' },
      relations: ['cases', 'admins'],
    });
  }

  // 7. Search Officers
  async searchOfficers(q: string): Promise<CaseOfficerEntity[]> {
    if (!q) return this.getRegisteredOfficers();
    const query = `%${q}%`;
    return this.officerRepo.find({
      where: [
        { name: Like(query) },
        { email: Like(query) },
        { country: Like(query) },
      ],
      relations: ['cases', 'admins'],
    });
  }

  // 8. Update Officer Details
  async updateOfficer(
    id: number,
    updateDto: UpdateCaseDto | UpdateValueDto,
  ): Promise<CaseOfficerEntity> {
    const officer = await this.findOneOfficer(id);
    if ('name' in updateDto && updateDto.name) officer.name = updateDto.name;
    if ('email' in updateDto && updateDto.email) officer.email = updateDto.email;
    if ('country' in updateDto && updateDto.country) officer.country = updateDto.country;
    if ('phone' in updateDto && updateDto.phone) officer.phone = String(updateDto.phone);

    return this.officerRepo.save(officer);
  }

  // 9. Remove Officer
  async deleteOfficer(id: number): Promise<{ success: boolean }> {
    const officer = await this.findOneOfficer(id);
    await this.officerRepo.remove(officer);
    return { success: true };
  }

  // --- RELATIONSHIP 1: ONE-TO-MANY (Case Officer -> Case Report) ---

  // 10. Create Case assigned to Case Officer
  async createCaseForOfficer(
    officerId: number,
    dto: CreateCaseDto,
  ): Promise<CaseReportEntity> {
    const officer = await this.findOneOfficer(officerId);

    const newCase = this.caseRepo.create({
      ...dto,
      status: 'Active',
      notes: [],
      officer: officer,
    });

    const savedCase = await this.caseRepo.save(newCase);

    // Send notification email to Case Officer
    try {
      await this.mailerService.sendMail({
        to: officer.email,
        subject: `New Case Assigned: ${savedCase.name}`,
        text: `Hello ${officer.name},\n\nA new missing person case "${savedCase.name}" (ID: ${savedCase.id}) has been assigned to you.\nLast seen location: ${savedCase.lastSeenLocation}.`,
      });
    } catch (err) {
      console.warn('Failed to send case assignment email:', err.message);
    }

    return savedCase;
  }

  // 11. Get Cases for a Case Officer
  async getCasesForOfficer(officerId: number): Promise<CaseReportEntity[]> {
    const officer = await this.findOneOfficer(officerId);
    return this.caseRepo.find({
      where: { officer: { id: officer.id } },
      order: { createdAt: 'DESC' },
    });
  }

  // 12. Delete a Case Report
  async deleteCase(caseId: number): Promise<{ success: boolean }> {
    const caseReport = await this.caseRepo.findOneBy({ id: caseId });
    if (!caseReport) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }
    await this.caseRepo.remove(caseReport);
    return { success: true };
  }

  // 13. Update Case Status
  async updateCaseStatus(
    caseId: number,
    status: string,
  ): Promise<CaseReportEntity> {
    const caseReport = await this.caseRepo.findOneBy({ id: caseId });
    if (!caseReport) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }
    caseReport.status = status;
    return this.caseRepo.save(caseReport);
  }

  // 14. Add Note to Case
  async addNoteToCase(
    caseId: number,
    createNoteDto: CreateNoteDto,
  ): Promise<CaseReportEntity> {
    const caseReport = await this.caseRepo.findOneBy({ id: caseId });
    if (!caseReport) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    const currentNotes = caseReport.notes || [];
    currentNotes.push({
      noteText: createNoteDto.noteText,
      addedBy: createNoteDto.addedBy,
      date: new Date().toISOString(),
    });

    caseReport.notes = currentNotes;
    return this.caseRepo.save(caseReport);
  }

  // --- RELATIONSHIP 2: MANY-TO-MANY (Case Officer <-> Admin) ---

  // 15. Assign Admin to Case Officer
  async assignAdmin(
    officerId: number,
    adminId: number,
  ): Promise<CaseOfficerEntity> {
    const officer = await this.officerRepo.findOne({
      where: { id: officerId },
      relations: ['admins'],
    });
    if (!officer) {
      throw new NotFoundException(`Case Officer with ID ${officerId} not found`);
    }

    const admin = await this.adminRepo.findOneBy({ id: adminId });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    const alreadyAssigned = officer.admins.some((a) => a.id === admin.id);
    if (!alreadyAssigned) {
      officer.admins.push(admin);
      await this.officerRepo.save(officer);
    }

    return this.findOneOfficer(officerId);
  }

  // 16. Get Admins assigned to Case Officer
  async getAdminsForOfficer(officerId: number): Promise<Admin[]> {
    const officer = await this.findOneOfficer(officerId);
    return officer.admins;
  }

  // 17. Remove Admin from Case Officer
  async removeAdminFromOfficer(
    officerId: number,
    adminId: number,
  ): Promise<CaseOfficerEntity> {
    const officer = await this.officerRepo.findOne({
      where: { id: officerId },
      relations: ['admins'],
    });
    if (!officer) {
      throw new NotFoundException(`Case Officer with ID ${officerId} not found`);
    }

    officer.admins = officer.admins.filter((a) => a.id !== adminId);
    await this.officerRepo.save(officer);

    return this.findOneOfficer(officerId);
  }
}
