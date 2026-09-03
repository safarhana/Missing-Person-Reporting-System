import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { VolunteerEntity } from '../volunteer/volunteer.entity';
import { CaseOfficerEntity } from '../case_officer/case_officer.entity';

import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PusherService } from './pusher.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(VolunteerEntity)
    private readonly volunteerRepository: Repository<VolunteerEntity>,

    @InjectRepository(CaseOfficerEntity)
    private readonly caseOfficerRepository: Repository<CaseOfficerEntity>,

    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly pusherService: PusherService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(
      createAdminDto.password,
      10,
    );

    createAdminDto.password = hashedPassword;

    const admin = this.adminRepository.create(createAdminDto);

    const savedAdmin = await this.adminRepository.save(admin);

    const recipientEmail =
      this.configService.get<string>('ADMIN_REGISTRATION_EMAIL') ||
      this.configService.get<string>('MAIL_USER');

    if (!recipientEmail) {
      this.logger.warn(
        'No recipient email configured (ADMIN_REGISTRATION_EMAIL / MAIL_USER); skipping registration notification email.',
      );
    } else {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: 'Admin Registration',
        text: `Welcome ${savedAdmin.fullName}! Your account has been created successfully.`,
      });
    }

    await this.pusherService.triggerAdminAlert({
      title: 'New Admin Registered',
      message: `Admin ${savedAdmin.fullName} has joined the system.`,
      type: 'success',
    });

    return savedAdmin;
  }

  findAll() {
    return this.adminRepository.find();
  }

  findByFullName(fullName: string) {
    return this.adminRepository.find({
      where: {
        fullName: Like(`%${fullName}%`),
      },
    });
  }

  async findById(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async findByUsername(username: string) {
    const admin = await this.adminRepository.findOne({
      where: { username },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async update(username: string, updateData: Partial<CreateAdminDto>) {
    const admin = await this.findByUsername(username);

    if (updateData.username) admin.username = updateData.username;
    if (updateData.fullName) admin.fullName = updateData.fullName;
    if (updateData.password) {
      admin.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.isActive !== undefined) admin.isActive = updateData.isActive;

    return this.adminRepository.save(admin);
  }

  async updateStatus(username: string, isActive: boolean) {
    const admin = await this.findByUsername(username);

    admin.isActive = isActive;

    const updatedAdmin = await this.adminRepository.save(admin);

    await this.pusherService.triggerAdminAlert({
      title: 'Admin Status Changed',
      message: `Admin "${username}" account is now ${isActive ? 'Active' : 'Inactive'}.`,
      type: isActive ? 'success' : 'warning',
    });

    return updatedAdmin;
  }

  async remove(username: string) {
    await this.findByUsername(username);

    return this.adminRepository.delete({
      username,
    });
  }

  async assignVolunteer(
    adminId: number,
    volunteerId: number,
  ) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const volunteer = await this.volunteerRepository.findOne({
      where: { id: volunteerId },
    });

    if (!volunteer) {
      throw new NotFoundException('Volunteer not found');
    }

    await this.volunteerRepository.update(
      volunteerId,
      {
        admin,
      },
    );

    const result = await this.volunteerRepository.findOne({
      where: { id: volunteerId },
      relations: {
        admin: true,
      },
    });

    await this.pusherService.triggerAdminAlert({
      title: 'Volunteer Assigned',
      message: `Volunteer "${volunteer.fullName || volunteer.username}" has been assigned to Admin #${adminId}.`,
      type: 'info',
    });

    return result;
  }

  async getVolunteers(adminId: number) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: {
        volunteers: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin.volunteers;
  }

  async removeVolunteer(
    adminId: number,
    volunteerId: number,
  ) {
    const volunteer = await this.volunteerRepository.findOne({
      where: { id: volunteerId },
      relations: {
        admin: true,
      },
    });

    if (!volunteer) {
      throw new NotFoundException('Volunteer not found');
    }

    if (!volunteer.admin || volunteer.admin.id !== adminId) {
      throw new NotFoundException(
        'Volunteer is not assigned to this admin',
      );
    }

    volunteer.admin = null;

    return this.volunteerRepository.save(volunteer);
  }

  async assignCaseOfficer(
    adminId: number,
    caseOfficerId: number,
  ) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: {
        caseOfficers: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const caseOfficer =
      await this.caseOfficerRepository.findOne({
        where: { id: caseOfficerId },
      });

    if (!caseOfficer) {
      throw new NotFoundException(
        'Case Officer not found',
      );
    }

    admin.caseOfficers.push(caseOfficer);

    await this.adminRepository.save(admin);

    const result = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: {
        caseOfficers: true,
      },
    });

    await this.pusherService.triggerAdminAlert({
      title: 'Case Officer Assigned',
      message: `Case Officer "${caseOfficer.name || caseOfficerId}" assigned to Admin #${adminId}.`,
      type: 'info',
    });

    return result;
  }

  async getCaseOfficers(adminId: number) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: {
        caseOfficers: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin.caseOfficers;
  }

  async removeCaseOfficer(
    adminId: number,
    caseOfficerId: number,
  ) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: {
        caseOfficers: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    admin.caseOfficers =
      admin.caseOfficers.filter(
        (officer) =>
          officer.id !== caseOfficerId,
      );

    await this.adminRepository.save(admin);

    return admin;
  }

  async broadcastAlert(data: {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'success' | 'alert';
  }) {
    return await this.pusherService.triggerAdminAlert(data);
  }
}