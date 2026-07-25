import { IsString } from 'class-validator';

export class VolunteerLoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}