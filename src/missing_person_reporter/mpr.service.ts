import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Mpr } from './mpr.entity';
import { CreateMprDto } from './dto/create_mpr.dto';
import { UpdateMprDto } from './dto/update_mpr.dto';

@Injectable()
export class MprService {
  constructor(
    @InjectRepository(Mpr)
    private readonly mprRepository: Repository<Mpr>,
  ) {}

  async createReport(dto: CreateMprDto): Promise<Mpr> {
    const derivedAge = dto.nid ? parseInt(dto.nid.substring(dto.nid.length - 2)) || 25 : 25;

    const newReport = this.mprRepository.create({
      fullName: dto.name,
      age: derivedAge,
      status: 'active',
    });

    return await this.mprRepository.save(newReport);
  }

  async updateStatus(id: number, status: 'active' | 'inactive'): Promise<Mpr> {
    const report = await this.mprRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    report.status = status;
    return await this.mprRepository.save(report);
  }

  async getInactiveUsers(): Promise<Mpr[]> {
    return await this.mprRepository.find({ where: { status: 'inactive' } });
  }

  async getUsersOlderThan40(): Promise<Mpr[]> {
    return await this.mprRepository.find({ where: { age: MoreThan(40) } });
  }

  async getAllReports(): Promise<Mpr[]> {
    return await this.mprRepository.find();
  }

  async getReportById(id: number): Promise<Mpr> {
    const report = await this.mprRepository.findOne({ where: { id } });
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
}