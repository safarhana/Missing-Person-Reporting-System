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
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

import { CaseOfficerService } from './case_officer.service';
import { CreateCaseOfficerDto } from './dto/create-case-officer.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UpdateStatusDto } from './dto/status.dto';
import { CreateNoteDto } from './dto/note.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { UpdateValueDto } from './dto/update-value.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('case-officer')
export class CaseOfficerController {
  constructor(private readonly caseOfficerService: CaseOfficerService) {}

  // 1. Officer Registration (Public, with PDF upload, BCrypt, Mailer)
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

  // 2. Get All Officers (TypeORM DB, with optional country filter)
  @Get()
  findAll(@Query('country') country?: string) {
    return this.caseOfficerService.getRegisteredOfficers(country);
  }

  // 3. Search Officers by query string
  @Get('search')
  search(@Query('q') q: string) {
    return this.caseOfficerService.searchOfficers(q);
  }

  // 4. Search Officers by Joining Date
  @Get('search/by-date')
  findByJoiningDate(@Query('date') date: string) {
    return this.caseOfficerService.findByJoiningDate(date);
  }

  // 5. Find Officers with Default Country
  @Get('search/default-country')
  findWithDefaultCountry() {
    return this.caseOfficerService.findWithDefaultCountry();
  }

  // 6. Get Officer by ID with relations
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.caseOfficerService.findOneOfficer(id);
  }

  // 7. Update Officer Details
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, skipMissingProperties: true }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCaseDto,
  ) {
    return this.caseOfficerService.updateOfficer(id, updateDto);
  }

  // 8. Update Officer Country (with Pipe transformation & validation)
  @Patch(':id/country')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateCountry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.caseOfficerService.updateCountry(id, updateCountryDto.country);
  }

  // 9. Delete Officer
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.caseOfficerService.deleteOfficer(id);
  }

  // =========================================================================
  // RELATIONSHIP 1: ONE-TO-MANY (Case Officer -> Case Reports)
  // =========================================================================

  // 10. Create Case Report assigned to Case Officer (One-to-Many CREATE)
  @Post(':id/cases')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createCase(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCaseDto: CreateCaseDto,
  ) {
    return this.caseOfficerService.createCaseForOfficer(id, createCaseDto);
  }

  // 11. Get Case Reports assigned to Case Officer (One-to-Many READ)
  @Get(':id/cases')
  getCases(@Param('id', ParseIntPipe) id: number) {
    return this.caseOfficerService.getCasesForOfficer(id);
  }

  // 12. Delete Case Report (One-to-Many DELETE)
  @Delete('cases/:caseId')
  deleteCase(@Param('caseId', ParseIntPipe) caseId: number) {
    return this.caseOfficerService.deleteCase(caseId);
  }

  // 13. Update Case Status
  @Patch('cases/:caseId/status')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateCaseStatus(
    @Param('caseId', ParseIntPipe) caseId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.caseOfficerService.updateCaseStatus(caseId, updateStatusDto.status);
  }

  // 14. Add Note to Case Report
  @Post('cases/:caseId/notes')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addNote(
    @Param('caseId', ParseIntPipe) caseId: number,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.caseOfficerService.addNoteToCase(caseId, createNoteDto);
  }

  // =========================================================================
  // RELATIONSHIP 2: MANY-TO-MANY (Case Officer <-> Admin)
  // =========================================================================

  // 15. Assign Admin to Case Officer (Many-to-Many CREATE)
  @Post(':id/assign-admin/:adminId')
  assignAdmin(
    @Param('id', ParseIntPipe) officerId: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return this.caseOfficerService.assignAdmin(officerId, adminId);
  }

  // 16. Get Admins assigned to Case Officer (Many-to-Many READ)
  @Get(':id/admins')
  getAdmins(@Param('id', ParseIntPipe) officerId: number) {
    return this.caseOfficerService.getAdminsForOfficer(officerId);
  }

  // 17. Remove Admin assignment from Case Officer (Many-to-Many DELETE)
  @Delete(':id/admins/:adminId')
  removeAdmin(
    @Param('id', ParseIntPipe) officerId: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return this.caseOfficerService.removeAdminFromOfficer(officerId, adminId);
  }
}
