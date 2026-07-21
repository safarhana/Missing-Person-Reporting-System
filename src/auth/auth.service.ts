import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Admin } from '../admin/admin.entity';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {

    const admin = await this.adminRepository.findOne({
      where: {
        username: loginDto.username,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid username');
    }



    if (admin.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: admin.id,
      username: admin.username,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}