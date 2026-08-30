import{
  IsNotEmpty,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  username: string;

  @IsNotEmpty({
  message: 'Password is required.',
  })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
  message: 'Password must contain at least one special character.',
 })
 password: string;

@IsNotEmpty()
isActive: boolean;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Full name can only contain letters and spaces.',  
})
  fullName: string;
}