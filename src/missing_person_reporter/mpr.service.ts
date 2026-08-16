import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, ILike } from 'typeorm';
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
  ) {}

  getMaxFileSize(): number {
    return Number(this.configService.get<number>('MPR_MAX_FILE_SIZE')) || 2097152;
  }

  async sendNotificationEmail(toEmail: string, subject?: string, message?: string) {
    const defaultSubject =
      this.configService.get<string>('MPR_DEFAULT_EMAIL_SUBJECT') ||
      'Missing Person System Alert';
    const defaultMessage =
      this.configService.get<string>('MPR_DEFAULT_EMAIL_MESSAGE') ||
      'A missing person report update has been processed.';

    try {
      await this.mailerService.sendMail({
        to: toEmail,
        subject: subject || defaultSubject,
        text: message || defaultMessage,
      });
      return { success: true, message: 'Email dispatched successfully!' };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async createReport(dto: CreateMprDto): Promise<Mpr> {
    const defaultAge =
      Number(this.configService.get<number>('MPR_DEFAULT_AGE')) || 25;
    const defaultStatus =
      (this.configService.get<'active' | 'inactive'>('MPR_DEFAULT_STATUS')) ||
      'active';

    const derivedAge = dto.nid
      ? parseInt(dto.nid.substring(dto.nid.length - 2), 10) || defaultAge
      : defaultAge;

    const newReport = this.mprRepository.create({
      fullName: dto.name,
      age: derivedAge,
      status: defaultStatus,
    });

    return await this.mprRepository.save(newReport);
  }

  async updateReport(id: number, dto: UpdateMprDto): Promise<Mpr> {
    const report = await this.getReportById(id);
    if (dto.name !== undefined) report.fullName = dto.name;
    if (dto.age !== undefined) report.age = dto.age;
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
    const threshold =
      Number(this.configService.get<number>('MPR_AGE_FILTER_THRESHOLD')) || 40;
    return await this.mprRepository.find({ where: { age: MoreThan(threshold) } });
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
      where: { fullName: ILike(`%${name || ''}%`) },
    });
  }

  async addNote(id: number, noteDto: NoteDto): Promise<NoteEntity> {
    const report = await this.getReportById(id);
    const commentText =
      noteDto.reporterComment ||
      (noteDto as any).comment ||
      (noteDto as any).text ||
      (noteDto as any).note;

    if (!commentText || typeof commentText !== 'string' || !commentText.trim()) {
      throw new BadRequestException('Reporter comment text must be provided');
    }

    const note = this.noteRepository.create({
      text: commentText.trim(),
      mpr: report,
    });
    return await this.noteRepository.save(note);
  }
}