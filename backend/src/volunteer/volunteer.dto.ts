import {IsEmail, Matches, IsIn, IsNumberString, IsString, IsInt, IsOptional} from 'class-validator';

export class VolunteerDto {
  
  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;
  
  @IsOptional()
  @Matches(/^(?=.*[A-Z]).{6,}$/, {
    message: 'Password must be at least 6 characters and contain one uppercase letter.',
  })
  password: string;

  @IsOptional()
  @IsString()
  district: string;

 @IsOptional()
  @IsIn(['male', 'female','others'], {
    message: 'Gender must be male or female or others.',
  })
  gender: string;

  @IsOptional()
  @IsNumberString({}, {
    message: 'Phone must contain only numbers.',
  })
  phone: string;

 @IsOptional()
 @IsInt()
  caseId: number;

 @IsOptional()
 @IsInt()
 adminId: number;
}