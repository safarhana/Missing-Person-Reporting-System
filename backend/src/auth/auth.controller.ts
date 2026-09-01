import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { VolunteerLoginDto } from './VolunteerLogin.dto';
import { CaseOfficerLoginDto } from '../case_officer/dto/login.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('volunteer-login')
  volunteerLogin(@Body() loginDto: VolunteerLoginDto) {
    return this.authService.volunteerLogin(loginDto);
  }

  @Post('case-officer-login')
  caseOfficerLogin(@Body() loginDto: CaseOfficerLoginDto) {
    return this.authService.caseOfficerLogin(loginDto);
  }
}