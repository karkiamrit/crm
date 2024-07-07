import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsOptional()
  @IsNumber()
  taskId: number;

  // @IsOptional()
  // @IsNumber()
  // customerId: number;

  @IsOptional()
  @IsString({ message: 'Content must be string' })
  content: string;
}
