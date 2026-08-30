import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query,
  ValidationPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { VolunteerService } from './volunteer.service';
import { VolunteerDto } from './volunteer.dto';

@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  createUser(@Body(new ValidationPipe()) dto: VolunteerDto) {
    return this.volunteerService.createUser(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updatePhnName(
    @Param('id', ParseIntPipe) id: string,
    @Body('phone') phone: string,
    @Body('fullName') fullName: string,
  ) {
    return this.volunteerService.updatePhnName(
      Number(id),
      phone,
      fullName,
    );
  }

  @Get('null-name')
  getUsersWithNullName() {
    return this.volunteerService.getUsersWithNullName();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.volunteerService.deleteUser(
      Number(id),
    );
  }

  @Get()
  getAllVolunteers() {
  return this.volunteerService.getAllVolunteers();
  }

  @Get(':id')
 getUserById(@Param('id', ParseIntPipe) id: number) {
  return this.volunteerService.getUserById(id);
 }

 @Patch(':id')
 @UseGuards(JwtAuthGuard)
 updatePhone(
  @Param('id', ParseIntPipe) id: number,
  @Body('phone') phone: string,) {
  return this.volunteerService.updatePhone(id, phone);
 }

 @Patch(':id/status')
 @UseGuards(JwtAuthGuard)
 toggleStatus(
  @Param('id', ParseIntPipe) id: number,) {
  return this.volunteerService.toggleStatus(id);
 }

 //----------------------------------------------------------------------------------------------------------------------------------------
@Patch(':volunteerId/admin/:adminId')
@UseGuards(JwtAuthGuard)
assignAdmin(
  @Param('volunteerId', ParseIntPipe) volunteerId: number,
  @Param('adminId', ParseIntPipe) adminId: number,
) {
  return this.volunteerService.assignAdmin(
    volunteerId,
    adminId,
  );
}

@Get('admin/:id')
getVolunteersByAdmin(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.volunteerService.getVolunteersByAdmin(id);
}

@Delete(':volunteerId/admin')
@UseGuards(JwtAuthGuard)
removeAdmin(
  @Param('volunteerId', ParseIntPipe) volunteerId: number,
) {
  return this.volunteerService.removeAdmin(volunteerId);
}

//----------------------------------------------------------------------------------------------------------------------------------------

@Post(':volunteerId/mpr/:mprId')
assignMpr(
  @Param('volunteerId', ParseIntPipe) volunteerId: number,
  @Param('mprId', ParseIntPipe) mprId: number,
) {
  return this.volunteerService.assignMpr(
    volunteerId,
    mprId,
  );
}

@Delete(':volunteerId/mpr/:mprId')
removeMpr(
  @Param('volunteerId', ParseIntPipe) volunteerId: number,
  @Param('mprId', ParseIntPipe) mprId: number,
) {
  return this.volunteerService.removeMpr(
    volunteerId,
    mprId,
  );
}
 /*
  @Get('cases')
  getAllCases() {
    return this.volunteerService.getAllCases();
  }

  @Get('cases/filter') 
  getCasesByDistrict(@Query('district') district: string) {
    return this.volunteerService.getCasesByDistrict(district);
  }

  @Get('cases/:id')
  getCaseById(@Param('id') id: string) {
    return this.volunteerService.getCaseById(Number(id));
  }

  @Get('assigned')
  getAssignedCases() {
    return this.volunteerService.getAssignedCases();
  }

  @Post('join')
  joinSearch(@Body() dto: VolunteerDto) {
    return this.volunteerService.joinSearch(dto);
  }

  @Put('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: VolunteerDto,
  ) {
    return this.volunteerService.updateProfile(Number(id), dto);
  }

  @Patch('case/:id')
  updateCaseStatus(@Param('id') id: string) {
    return this.volunteerService.updateCaseStatus(Number(id));
  }

  @Delete('leave/:id')
  leaveCase(@Param('id') id: string) {
    return this.volunteerService.leaveCase(Number(id));
  }
    */
  
}