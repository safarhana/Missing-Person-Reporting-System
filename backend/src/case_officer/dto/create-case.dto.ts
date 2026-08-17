import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateCaseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  age: number;

  @IsNotEmpty()
  @IsString()
  lastSeenLocation: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  contactNumber: string;
}