import { IsNotEmpty, IsString } from 'class-validator';

export class NoteDto {
  @IsNotEmpty({ message: 'Reporter comment is required' })
  @IsString({ message: 'Reporter comment must be a string' })
  reporterComment: string;
}