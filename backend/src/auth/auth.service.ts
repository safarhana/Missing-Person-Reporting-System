import { Injectable, UnauthorizedException, NotFoundException,
  BadRequestException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/admin.entity';
import { LoginDto } from './login.dto';
import { VolunteerEntity } from '../volunteer/volunteer.entity';
import { VolunteerLoginDto } from './VolunteerLogin.dto';
import { randomInt } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(VolunteerEntity)
    private volunteerRepository: Repository<VolunteerEntity>,
    private jwtService: JwtService,
     private readonly mailService: MailerService,
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
  volunteer: {
    id: volunteer.id,
    username: volunteer.username,
    fullName: volunteer.fullName,
    email: volunteer.email,
    phone: volunteer.phone,
    isActive: volunteer.isActive,
    }
    }
  }

  //forget password

  async forgotPassword(
    username: string,
  ) {

    const volunteer =
      await this.volunteerRepository.findOne({
        where: {
          username: username,
        },
      });


    if (!volunteer) {
      throw new NotFoundException(
        'No volunteer account found with this username.',
      );
    }

    if (!volunteer.email) {

      throw new BadRequestException(
        'This volunteer account does not have an email address.',
      );

    }


    const resetCode =  randomInt(100000, 1000000,).toString();



    const resetExpires =
      new Date(
        Date.now() +
        5 * 60 * 1000,
      );

    volunteer.passwordResetCode =
      resetCode;


    volunteer.passwordResetExpires =
      resetExpires;


    await this.volunteerRepository.save(
      volunteer,
    );

    await this.mailService.sendMail({

      to: volunteer.email,

      subject:
        'Volunteer Password Reset Code',

      text:`
      Hello ${volunteer.fullName || volunteer.username},

      Your password reset verification code is:

      ${resetCode}

      This code will expire in 5 minutes.

      If you did not request a password reset, please ignore this email.

      Thank you,
      Missing Person Reporting System`,

    });

    return {

      message:
        'A password reset code has been sent to your registered email address.',

    };

  }

  async verifyResetCode(
    username: string,
    code: string,
  ) {

    const volunteer =
      await this.volunteerRepository.findOne({
        where: {
          username: username,
        },
      });


    if (!volunteer) {

      throw new NotFoundException(
        'Volunteer account not found.',
      );

    }

    if (!volunteer.passwordResetCode) {

      throw new BadRequestException(
        'No password reset request found. Please request a new code.',
      );

    }

    if (
      volunteer.passwordResetCode !== code
    ) {

      throw new BadRequestException(
        'Invalid verification code.',
      );

    }

    if (
      !volunteer.passwordResetExpires ||
      volunteer.passwordResetExpires <
        new Date()
    ) {

      throw new BadRequestException(
        'Verification code has expired. Please request a new code.',
      );

    }

    return {

      message:
        'Verification code is correct.',

    };

  }

  async resetPassword(
    username: string,
    code: string,
    newPassword: string,
  ) {

  const volunteer =
      await this.volunteerRepository.findOne({
        where: {
          username: username,
        },
      });


    if (!volunteer) {

      throw new NotFoundException(
        'Volunteer account not found.',
      );

    }
 
    if (!volunteer.passwordResetCode) {

      throw new BadRequestException(
        'No password reset request found.',
      );

    }
 
    if (
      volunteer.passwordResetCode !== code
    ) {

      throw new BadRequestException(
        'Invalid verification code.',
      );

    }
 
    if (
      !volunteer.passwordResetExpires ||
      volunteer.passwordResetExpires <
        new Date()
    ) {

      throw new BadRequestException(
        'Verification code has expired. Please request a new code.',
      );

    }
 
    const hashedPassword =
      await bcrypt.hash( newPassword, 10,);

 

    volunteer.password = hashedPassword;

    volunteer.passwordResetCode = null;


    volunteer.passwordResetExpires = null;


    await this.volunteerRepository.save(volunteer,);

    return {

      message:
        'Password reset successfully. You can now login with your new password.',

    };

  }





}