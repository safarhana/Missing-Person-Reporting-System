import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class StatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsString({ message: 'Status must be a string' })
  @IsIn(['active', 'inactive'], { message: 'Status must be either active or inactive' })
  status: 'active' | 'inactive';
}