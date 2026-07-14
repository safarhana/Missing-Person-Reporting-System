import { IsNotEmpty, Matches, MinLength, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCaseOfficerDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'Name must not contain special characters',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/^01[0-9]*$/, {
    message: 'Phone number must start with 01',
  })
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  country?: string;
}
