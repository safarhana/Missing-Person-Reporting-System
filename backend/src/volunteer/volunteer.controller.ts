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
  updatePhnNameEmail(
    @Param('id', ParseIntPipe) id: string,
    @Body('phone') phone: string,
    @Body('fullName') fullName: string,
    @Body('email') email: string
  ) {
    return this.volunteerService.updatePhnNameEmail(
      Number(id),
      phone,
      fullName,
      email,
    );
  }

  @Get('getVolunteersWithMissingInfo')
  getVolunteersWithMissingInfo() {
    return this.volunteerService.getVolunteersWithMissingInfo();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
deleteUser(
  @Param('id', ParseIntPipe) id: number,
  @Body('username') username: string,
  @Body('password') password: string,
) {
  return this.volunteerService.deleteUser(
    id,
    username,
    password,
  );
}

  @Get()
  getAllVolunteers() {
  return this.volunteerService.getAllVolunteers();
  }

  @Get(':id')
  //@UseGuards(JwtAuthGuard)
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
 //@UseGuards(JwtAuthGuard)
 toggleStatus(
  @Param('id', ParseIntPipe) id: number,) {
  return this.volunteerService.toggleStatus(id);
 }

@Patch(':volunteerId/admin/:adminId')
// @UseGuards(JwtAuthGuard)
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
//@UseGuards(JwtAuthGuard)
removeAdmin(
  @Param('volunteerId', ParseIntPipe) volunteerId: number,
) {
  return this.volunteerService.removeAdmin(volunteerId);
}

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
}