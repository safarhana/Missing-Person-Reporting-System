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
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';

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

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get('search')
  findByFullName(
    @Query('name', new DefaultValuePipe(''))
    name: string,
  ) {
    return this.adminService.findByFullName(name);
  }

  @Get('id/:id')
  findById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.adminService.findById(id);
  }

  @Get(':username')
  findByUsername(
    @Param('username')
    username: string,
  ) {
    return this.adminService.findByUsername(username);
  }

  @Put(':username')
  update(
    @Param('username')
    username: string,

    @Body(new ValidationPipe())
    updateData: CreateAdminDto,
  ) {
    return this.adminService.update(username, updateData);
  }

  @Patch('status/:username')
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
  remove(
    @Param('username')
    username: string,
  ) {
    return this.adminService.remove(username);
  }
}