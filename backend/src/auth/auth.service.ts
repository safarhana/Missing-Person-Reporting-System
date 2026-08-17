import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/admin.entity';
import { LoginDto } from './login.dto';
import { VolunteerEntity } from '../volunteer/volunteer.entity';
import { VolunteerLoginDto } from './VolunteerLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(VolunteerEntity)
    private volunteerRepository: Repository<VolunteerEntity>,
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

    const passwordMatch = await bcrypt.compare(
     loginDto.password,
     admin.password,
     );

     if (!passwordMatch) {
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

  async volunteerLogin(loginDto: VolunteerLoginDto) {
    const volunteer = await this.volunteerRepository.findOne({
      where: {
        username: loginDto.username,
      },
    });

    if (!volunteer) {
      throw new UnauthorizedException('Invalid username');
    }

    const match = await bcrypt.compare(
      loginDto.password,
      volunteer.password,
    );

    if (!match) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: volunteer.id,
      username: volunteer.username,
      role: 'volunteer',
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}