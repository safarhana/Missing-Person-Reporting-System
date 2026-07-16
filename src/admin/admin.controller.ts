import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {} 

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('search')
  findByFullName(@Query('name') name: string) {
    return this.adminService.findByFullName(name);
  }

  


  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.adminService.findByUsername(username);
  }

  
  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.adminService.remove(username);
  } 

  

}