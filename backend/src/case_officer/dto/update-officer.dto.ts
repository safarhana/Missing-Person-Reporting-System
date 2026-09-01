import { IsOptional, IsString, IsEmail, Matches, MaxLength } from 'class-validator';

export class UpdateOfficerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'Name must not contain special characters',
  })
  name?: string;

  @IsOptional()
  @IsEmail({}, {
    message: 'Please provide a valid email address',
  })
  email?: string;

  @IsOptional()
  @Matches(/^01[0-9]*$/, {
    message: 'Phone number must start with 01',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  country?: string;
}
