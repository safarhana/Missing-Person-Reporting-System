import {
  Body, Controller, Delete, Get, Param, Patch, Post, Put, Query,
} from '@nestjs/common';

import { VolunteerService } from './volunteer.service';
import { VolunteerDto } from './volunteer.dto';

@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

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
}