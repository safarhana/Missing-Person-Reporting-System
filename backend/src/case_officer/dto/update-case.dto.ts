import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateCaseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsString()
  lastSeenLocation?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;
}
