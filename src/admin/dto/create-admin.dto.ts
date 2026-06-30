import {
  IsNotEmpty,
  Matches,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @Matches(/^[^0-9]*$/, {
    message: 'Name should not contain numbers',
  })
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  @Matches(/[@#$&]/, {
    message:
      'Password must contain one special character (@, #, $ or &)',
  })
  password: string;

  @IsDateString({}, {
    message: 'Please enter a valid date',
  })
  date: string;

  @IsUrl({}, {
    message: 'Please enter a valid social media URL',
  })
  socialMedia: string;
}