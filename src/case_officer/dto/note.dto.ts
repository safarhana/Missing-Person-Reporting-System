import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  noteText: string;

  @IsNotEmpty()
  @IsString()
  addedBy: string;
}
