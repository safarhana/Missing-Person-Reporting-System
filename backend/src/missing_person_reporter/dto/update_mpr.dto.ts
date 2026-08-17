import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateMprDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age must be greater than or equal to 0' })
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