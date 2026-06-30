import {IsEmail, Matches, IsIn, IsNumberString, IsString, IsInt} from 'class-validator';

export class VolunteerDto {

  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@aiub\.edu$/, {
    message: 'Email must be an AIUB email.',
  })
  email: string;

  @Matches(/^(?=.*[A-Z]).{6,}$/, {
    message: 'Password must be at least 6 characters and contain one uppercase letter.',
  })
  password: string;

  @IsString()
  district: string;

   @IsIn(['male', 'female'], {
    message: 'Gender must be male or female.',
  })
  gender: string;

   @IsNumberString({}, {
    message: 'Phone must contain only numbers.',
  })
  phone: string;

  @IsInt()
  caseId: number;
}