import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCountryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  country: string;
}
