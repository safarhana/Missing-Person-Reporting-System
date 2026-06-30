import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMprDto } from './dto/create_mpr.dto';
import { UpdateMprDto } from './dto/update_mpr.dto';

@Injectable()
export class MprService {
  private reports = [
    { id: 1, name: 'Rahim Uddin', email: 'rahim@mpr.xyz', nid: '1234567890', city: 'dhaka', status: 'Missing', reporterComment: 'Last seen near station.' },
    { id: 2, name: 'Karim Ali', email: 'karim@mpr.xyz', nid: '0987654321', city: 'chittagong', status: 'Found', reporterComment: 'Returned home safely.' },
  ];

  getAllReports() {
    return this.reports;
  }

  getReportById(id: number) {
    const report = this.reports.find((r) => r.id === id);
    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);
    return report;
  }

  searchByName(name: string) {
    return this.reports.filter((r) =>
      r.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  filterByCity(city: string) {
    return this.reports.filter((r) => r.city.toLowerCase() === city.toLowerCase());
  }

  
  createReport(dto: CreateMprDto) {
    const newReport = {
      id: this.reports.length + 1,
      ...dto,
      city: 'dhaka',
      status: 'Missing',
      reporterComment: '',
    };
    this.reports.push(newReport);
    return { message: 'Report created successfully with validation', data: newReport };
  }

  updateReport(id: number, dto: UpdateMprDto) {
    const index = this.reports.findIndex((r) => r.id === id);
    if (index === -1) throw new NotFoundException(`Report with ID ${id} not found`);
    
    this.reports[index] = { ...this.reports[index], ...dto };
    return { message: 'Report fully updated', data: this.reports[index] };
  }

  updateStatus(id: number, status: string) {
    const report = this.getReportById(id);
    report.status = status;
    return { message: 'Report status updated successfully', data: report };
  }

  addNoteToReport(id: number, comment: string) {
    const report = this.getReportById(id);
    report.reporterComment = comment;
    return { message: 'Note added successfully', data: report };
  }
}