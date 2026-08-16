import { 
  Controller, Get, Post, Put, Patch, Delete, 
  Param, Query, Body, ParseIntPipe, UseGuards, 
  UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, UsePipes, ValidationPipe 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MprService } from './mpr.service';
import { CreateMprDto } from './dto/create_mpr.dto';
import { UpdateMprDto } from './dto/update_mpr.dto';
import { NoteDto } from './dto/note.dto';
import { StatusDto } from './dto/status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('mpr')
@UseGuards(JwtAuthGuard)
export class MprController {
  constructor(
    private readonly mprService: MprService,
    private readonly configService: ConfigService,
  ) {}

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
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('nidImage'))
  create(
    @Body() createDto: CreateMprDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2097152, message: 'NID Image size must not exceed 2MB!' }),
        ],
      }),
    ) file?: Express.Multer.File,
  ) {
    return this.mprService.createReport(createDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMprDto,
  ) {
    return this.mprService.updateReport(id, updateDto);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body() statusDto: StatusDto,
  ) {
    return this.mprService.updateStatus(id, statusDto.status);
  }

  @Delete(':id')
  deleteReport(@Param('id', ParseIntPipe) id: number) {
    return this.mprService.deleteReport(id);
  }

  @Post(':id/notes')
  @UsePipes(new ValidationPipe({ transform: true }))
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() noteDto: NoteDto,
  ) {
    return this.mprService.addNote(id, noteDto);
  }

  @Post('send-email')
  async sendEmail(
    @Body('email') email: string,
    @Body('subject') subject?: string,
    @Body('message') message?: string,
  ) {
    return await this.mprService.sendNotificationEmail(email, subject, message);
  }

  @Delete(':id')
  deleteReport(@Param('id', ParseIntPipe) id: number) {
    return this.mprService.deleteReport(id);
  }

  @Post(':id/notes')
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() noteDto: NoteDto,
  ) {
    return this.mprService.addNote(id, noteDto);
  }

  @Post('send-email')
  async sendEmail(
    @Body('email') email: string,
    @Body('subject') subject?: string,
    @Body('message') message?: string,
  ) {
    return await this.mprService.sendNotificationEmail(
      email,
      subject || 'Missing Person System Alert',
      message || 'A missing person report update has been processed.',
    );
  }
}