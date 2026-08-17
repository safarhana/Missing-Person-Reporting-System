import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateValueDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

   @IsNotEmpty()
  @IsString()
  email: string;

   @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  country: string;

}
