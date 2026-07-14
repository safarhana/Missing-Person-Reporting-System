import { Controller, Get, Post, Put, Patch, Param, Query, Body, ParseIntPipe } from '@nestjs/common';
import { MprService } from './mpr.service';
import { CreateMprDto } from './dto/create_mpr.dto';
import { UpdateMprDto } from './dto/update_mpr.dto';
import { StatusDto } from './dto/status.dto';
import { NoteDto } from './dto/note.dto';
import { UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('mpr')
export class MprController {
  constructor(private readonly mprService: MprService) {}

  @Get('inactive')
  findInactive() {
    return this.mprService.getInactiveUsers();
  }

  @Get('older-than-40')
  findOlder() {
    return this.mprService.getUsersOlderThan40();
  }

  @Get()
  getAll() {
    return this.mprService.getAllReports();
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.mprService.searchByName(name);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.mprService.getReportById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('nidImage'))
  create(
    @Body() createDto: CreateMprDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2097152, message: 'NID Image size must not exceed 2MB!' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    return this.mprService.createReport(createDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body('status') status: 'active' | 'inactive'
  ) {
    return this.mprService.updateStatus(id, status);
  }
}