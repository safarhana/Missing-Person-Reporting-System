import { Controller, Get, Post, Put, Patch, Param, Query, Body } from '@nestjs/common';
import { MprService } from './mpr.service';
import { CreateMissingReportDto } from './dto/create_mpr.dto';
import { UpdateMissingReportDto } from './dto/update_mpr.dto';
import { StatusDto } from './dto/status.dto';
import { NoteDto } from './dto/note.dto';

@Controller('missing')
export class MprController {
  constructor(private readonly mprService: MprService) {}

  @Get()
  getAll() {
    return this.mprService.getAllReports();
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.mprService.searchByName(name);
  }

  @Get('location')
  filterByLocation(@Query('city') city: string) {
    return this.mprService.filterByCity(city);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.mprService.getReportById(Number(id));
  }

  @Post()
  create(@Body() createDto: CreateMissingReportDto) {
    return this.mprService.createReport(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateMissingReportDto) {
    return this.mprService.updateReport(Number(id), updateDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() statusDto: StatusDto) {
    return this.mprService.updateStatus(Number(id), statusDto.status);
  }

  @Patch(':id/note')
  addNote(@Param('id') id: string, @Body() noteDto: NoteDto) {
    return this.mprService.addNoteToReport(Number(id), noteDto.reporterComment);
  }
}