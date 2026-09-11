import {
  IsString,
  Matches,
} from 'class-validator';

export class ForgotPasswordDto {

  @IsString()
  username: string;

}

export class VerifyResetCodeDto {

  @IsString()
  username: string;

  @IsString()
  code: string;

}

export class ResetPasswordDto {

  @IsString()
  username: string;

  @IsString()
  code: string;

  @Matches(/^(?=.*[A-Z]).{6,}$/, {
    message:
      'Password must be at least 6 characters and contain one uppercase letter.',
  })
  password: string;

}