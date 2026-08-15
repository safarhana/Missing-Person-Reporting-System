import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Mpr } from './mpr.entity';
import { NoteEntity } from './note.entity';
import { CreateMprDto } from './dto/create_mpr.dto';
import { UpdateMprDto } from './dto/update_mpr.dto';
import { NoteDto } from './dto/note.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MprService {
  constructor(
    @InjectRepository(Mpr)
    private readonly mprRepository: Repository<Mpr>,
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async sendNotificationEmail(toEmail: string, subject: string, message: string) {
    try {
      await this.mailerService.sendMail({
        to: toEmail,
        subject: subject,
        text: message,
      });
      return { success: true, message: 'Email dispatched successfully!' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }


  async createReport(dto: CreateMprDto): Promise<Mpr> {
    const derivedAge = dto.nid ? parseInt(dto.nid.substring(dto.nid.length - 2)) || 25 : 25;

    const newReport = this.mprRepository.create({
      fullName: dto.name,
      age: derivedAge,
      status: 'active',
    });

    return await this.mprRepository.save(newReport);
  }

  async updateReport(id: number, dto: UpdateMprDto): Promise<Mpr> {
    const report = await this.getReportById(id);
    if (dto.name) report.fullName = dto.name;
    return await this.mprRepository.save(report);
  }

  async updateStatus(id: number, status: 'active' | 'inactive'): Promise<Mpr> {
    const report = await this.getReportById(id);
    report.status = status;
    return await this.mprRepository.save(report);
  }

  async deleteReport(id: number): Promise<{ message: string }> {
    const report = await this.getReportById(id);
    await this.mprRepository.remove(report);
    return { message: `Report with ID ${id} deleted successfully.` };
  }

  async getInactiveUsers(): Promise<Mpr[]> {
    return await this.mprRepository.find({ where: { status: 'inactive' } });
  }

  async getUsersOlderThan40(): Promise<Mpr[]> {
    return await this.mprRepository.find({ where: { age: MoreThan(40) } });
  }

  async getAllReports(): Promise<Mpr[]> {
    return await this.mprRepository.find({ relations: ['notes', 'volunteers'] });
  }

  async getReportById(id: number): Promise<Mpr> {
    const report = await this.mprRepository.findOne({ 
      where: { id },
      relations: ['notes', 'volunteers'],
    });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async searchByName(name: string): Promise<Mpr[]> {
    return await this.mprRepository.find({
      where: { fullName: name },
    });
  }

  async addNote(id: number, noteDto: NoteDto): Promise<NoteEntity> {
    const report = await this.getReportById(id);
    const note = this.noteRepository.create({
      text: (noteDto as any).comment || (noteDto as any).text || (noteDto as any).note,
      mpr: report,
    });
    return await this.noteRepository.save(note);
  }
}