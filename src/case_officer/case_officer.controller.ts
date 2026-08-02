import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

import { CaseOfficerService } from './case_officer.service';
import { CreateCaseOfficerDto } from './dto/create-case-officer.dto';
import { LoginCaseOfficerDto } from './dto/login-case-officer.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UpdateStatusDto } from './dto/status.dto';
import { CreateNoteDto } from './dto/note.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('case-officer')
export class CaseOfficerController {
  constructor(private readonly caseOfficerService: CaseOfficerService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(pdf)$/i)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  async register(
    @Body() body: CreateCaseOfficerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const savedOfficer = await this.caseOfficerService.registerOfficer(
      body,
      file ? file.filename : null,
    );
    return {
      message: 'Case Officer registered successfully',
      officerId: savedOfficer.id,
      uniqueId: savedOfficer.uniqueId,
      file: savedOfficer.file,
      data: {
        name: savedOfficer.name,
        email: savedOfficer.email,
        phone: savedOfficer.phone,
        country: savedOfficer.country,
      },
    };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginCaseOfficerDto) {
    return this.caseOfficerService.login(loginDto);
  }

  @Get()
  findAll(@Query('country') country?: string) {
    return this.caseOfficerService.getRegisteredOfficers(country);
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.caseOfficerService.searchOfficers(q);
  }

  @Get('search/by-date')
  findByJoiningDate(@Query('date') date: string) {
    return this.caseOfficerService.findByJoiningDate(date);
  }

  @Get('search/default-country')
  findWithDefaultCountry() {
    return this.caseOfficerService.findWithDefaultCountry();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.caseOfficerService.findOneOfficer(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, skipMissingProperties: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCaseDto,
  ) {
    return this.caseOfficerService.updateOfficer(id, updateDto);
  }

  @Patch(':id/country')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateCountry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.caseOfficerService.updateCountry(id, updateCountryDto.country);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.caseOfficerService.deleteOfficer(id);
  }

  @Post(':id/cases')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createCase(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCaseDto: CreateCaseDto,
  ) {
    return this.caseOfficerService.createCaseForOfficer(id, createCaseDto);
  }

  @Get(':id/cases')
  @UseGuards(JwtAuthGuard)
  getCases(@Param('id', ParseIntPipe) id: number) {
    return this.caseOfficerService.getCasesForOfficer(id);
  }

  @Delete('cases/:caseId')
  @UseGuards(JwtAuthGuard)
  deleteCase(@Param('caseId', ParseIntPipe) caseId: number) {
    return this.caseOfficerService.deleteCase(caseId);
  }

  @Patch('cases/:caseId/status')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateCaseStatus(
    @Param('caseId', ParseIntPipe) caseId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.caseOfficerService.updateCaseStatus(caseId, updateStatusDto.status);
  }

  @Post('cases/:caseId/notes')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addNote(
    @Param('caseId', ParseIntPipe) caseId: number,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.caseOfficerService.addNoteToCase(caseId, createNoteDto);
  }

  @Post(':id/assign-admin/:adminId')
  @UseGuards(JwtAuthGuard)
  assignAdmin(
    @Param('id', ParseIntPipe) officerId: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return this.caseOfficerService.assignAdmin(officerId, adminId);
  }

  @Get(':id/admins')
  @UseGuards(JwtAuthGuard)
  getAdmins(@Param('id', ParseIntPipe) officerId: number) {
    return this.caseOfficerService.getAdminsForOfficer(officerId);
  }

  @Delete(':id/admins/:adminId')
  @UseGuards(JwtAuthGuard)
  removeAdmin(
    @Param('id', ParseIntPipe) officerId: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return this.caseOfficerService.removeAdminFromOfficer(officerId, adminId);
  }
}
