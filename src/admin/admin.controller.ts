import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Get('reports')
  getReports() {
    return this.adminService.getReports();
  }

  @Get('reports/filter')
  filterReports(@Query('status') status: string) {
    return this.adminService.filterReports(status);
  }

  @Post('users')
  createUser(@Body() body: CreateAdminDto) {
    return this.adminService.createUser(body);
  }

  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: CreateAdminDto,
  ) {
    return this.adminService.updateUser(id, body);
  }

  @Patch('users/:id')
  patchUser(@Param('id') id: string) {
    return this.adminService.patchUser(id);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
