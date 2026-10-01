import { Body, Controller, Post, ValidationPipe,Res, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { VolunteerLoginDto } from './VolunteerLogin.dto';
import { Response } from 'express';
import {
  ForgotPasswordDto,
  VerifyResetCodeDto,
  ResetPasswordDto,
} from './VolunteerPassword.dto';


@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('volunteer-login')
  async volunteerLogin(
    @Body() loginDto: VolunteerLoginDto,
    @Res({ passthrough: true }) res: Response, 
  ) {
     const result = await this.authService.volunteerLogin(loginDto); 
     res.cookie( 'access_token', result.access_token, 
    { httpOnly: true, 
      secure: false, 
      sameSite: 'lax', 
      maxAge: 60 * 60 * 1000, 
    }, );
     
    return  { volunteer: result.volunteer }; 
    }

  @Post('forgot-password')
  forgotPassword(
    @Body(new ValidationPipe())
    dto: ForgotPasswordDto,
  ) {

    return this.authService.forgotPassword(
      dto.username,
    );

  }

  @Post('verify-reset-code')
  verifyResetCode(
    @Body(new ValidationPipe())
    dto: VerifyResetCodeDto,
  ) {

    return this.authService.verifyResetCode(
      dto.username,
      dto.code,
    );

  }


  @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe())
    dto: ResetPasswordDto,
  ) {

    return this.authService.resetPassword(
      dto.username,
      dto.code,
      dto.password,
    );

  }


}