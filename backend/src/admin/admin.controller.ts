import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ValidationPipe,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { TriggerAlertDto } from './dto/alert.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(
    @Body(new ValidationPipe())
    createAdminDto: CreateAdminDto,
  ) {
    return this.adminService.create(createAdminDto);
  }

  @Post('alerts')
  @UseGuards(JwtAuthGuard)
  broadcastAlert(
    @Body(new ValidationPipe())
    dto: TriggerAlertDto,
  ) {
    return this.adminService.broadcastAlert(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.adminService.findAll();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  findByFullName(
    @Query('name', new DefaultValuePipe(''))
    name: string,
  ) {
    return this.adminService.findByFullName(name);
  }

  @Get('id/:id')
  @UseGuards(JwtAuthGuard)
  findById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.adminService.findById(id);
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  findByUsername(
    @Param('username')
    username: string,
  ) {
    return this.adminService.findByUsername(username);
  }

  @Put(':username')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('username')
    username: string,

    @Body(new ValidationPipe())
    updateData: CreateAdminDto,
  ) {
    return this.adminService.update(username, updateData);
  }

  @Patch('status/:username')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('username')
    username: string,

    @Body('isActive')
    isActive: boolean,
  ) {
    return this.adminService.updateStatus(
      username,
      isActive,
    );
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('username')
    username: string,
  ) {
    return this.adminService.remove(username);
  }

  @Post(':adminId/volunteer/:volunteerId')
  @UseGuards(JwtAuthGuard)
  assignVolunteer(
    @Param('adminId', ParseIntPipe)
    adminId: number,

    @Param('volunteerId', ParseIntPipe)
    volunteerId: number,
  ) {
    return this.adminService.assignVolunteer(
      adminId,
      volunteerId,
    );
  }

  @Get(':adminId/volunteers')
  @UseGuards(JwtAuthGuard)
  getVolunteers(
    @Param('adminId', ParseIntPipe)
    adminId: number,
  ) {
    return this.adminService.getVolunteers(adminId);
  }

  @Delete(':adminId/volunteer/:volunteerId')
  @UseGuards(JwtAuthGuard)
  removeVolunteer(
    @Param('adminId', ParseIntPipe)
    adminId: number,

    @Param('volunteerId', ParseIntPipe)
    volunteerId: number,
  ) {
    return this.adminService.removeVolunteer(
      adminId,
      volunteerId,
    );
  }

  @Post(':adminId/case-officer/:caseOfficerId')
  @UseGuards(JwtAuthGuard)
  assignCaseOfficer(
    @Param('adminId', ParseIntPipe)
    adminId: number,

    @Param('caseOfficerId', ParseIntPipe)
    caseOfficerId: number,
  ) {
    return this.adminService.assignCaseOfficer(
      adminId,
      caseOfficerId,
    );
  }

  @Get(':adminId/case-officers')
  @UseGuards(JwtAuthGuard)
  getCaseOfficers(
    @Param('adminId', ParseIntPipe)
    adminId: number,
  ) {
    return this.adminService.getCaseOfficers(
      adminId,
    );
  }

  @Delete(':adminId/case-officer/:caseOfficerId')
  @UseGuards(JwtAuthGuard)
  removeCaseOfficer(
    @Param('adminId', ParseIntPipe)
    adminId: number,

    @Param('caseOfficerId', ParseIntPipe)
    caseOfficerId: number,
  ) {
    return this.adminService.removeCaseOfficer(
      adminId,
      caseOfficerId,
    );
  }
}