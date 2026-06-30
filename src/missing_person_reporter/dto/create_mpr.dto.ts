import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateMprDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name must contain only alphabets and spaces' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.xyz$/, { 
    message: 'Email must be a valid email and end with .xyz domain' 
  })
  email: string;

  @IsNotEmpty({ message: 'NID is required' })
  @Matches(/^\d{10}$|^\d{13}$|^\d{17}$/, { 
    message: 'NID must be a valid format (10, 13, or 17 digits)' 
  })
  nid: string;
}