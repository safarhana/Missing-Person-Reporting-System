import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class TriggerAlertDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsIn(['info', 'warning', 'success', 'alert'])
  type?: 'info' | 'warning' | 'success' | 'alert';
}
