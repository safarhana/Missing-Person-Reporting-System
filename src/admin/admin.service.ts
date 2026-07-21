import {
  Injectable,
  NotFoundException, 
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  
  create(createAdminDto: CreateAdminDto) {
    const admin = this.adminRepository.create(createAdminDto);
    return this.adminRepository.save(admin);
  }

  
  findAll() {
    return this.adminRepository.find();
  }

  
  findByFullName(fullName: string) {
    return this.adminRepository.find({
      where: {
        fullName: Like(`%${fullName}%`),
      },
    });
  }

  
  async findById(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

 
  async findByUsername(username: string) {
    const admin = await this.adminRepository.findOne({
      where: { username },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }


  async update(username: string, updateData: CreateAdminDto) {
    const admin = await this.findByUsername(username);

    admin.username = updateData.username;
    admin.fullName = updateData.fullName;
    admin.password = updateData.password;
    admin.isActive = updateData.isActive;

    return this.adminRepository.save(admin);
  }

  
  async updateStatus(username: string, isActive: boolean) {
    const admin = await this.findByUsername(username);

    admin.isActive = isActive;

    return this.adminRepository.save(admin);
  }

  
  async remove(username: string) {
    await this.findByUsername(username);

    return this.adminRepository.delete({
      username,
    });
  }
}
  