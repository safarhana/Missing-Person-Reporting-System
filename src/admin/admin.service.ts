import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, Like} from 'typeorm';

import {Admin} from './admin.entity';
import {CreateAdminDto} from './dto/create-admin.dto';

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


  findByFullName(fullName: string) {
    return this.adminRepository.find({
      where: { fullName: Like(`%${fullName}%`) },
    });
  } 

  findByUsername(username: string) {
    return this.adminRepository.findOne({
      where: { username},
    });
  }

  remove(username: string) {
    return this.adminRepository.delete({
      username,

    })

  }

}
  