import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiPropertyOptional({ description: 'The task ID associated with the note' })
  @IsOptional()
  @IsNumber()
  taskId: number;

  // @ApiPropertyOptional({ description: 'The customer ID associated with the note' })
  // @IsOptional()
  // @IsNumber()
  // customerId: number;

  @ApiPropertyOptional({ description: 'The content of the note' })
  @IsOptional()
  @IsString({ message: 'Content must be string' })
  content: string;
}