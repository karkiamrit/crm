import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiPropertyOptional({ description: 'The task ID associated with the note' })
  @IsOptional()
  @IsNumber({}, { message: 'Task Id must be a number' })
  taskId?: number;

  // @ApiPropertyOptional({ description: 'The customer ID associated with the note' })
  // @IsOptional()
  // @IsNumber({}, { message: 'Customer Id must be a number' })
  // customerId?: number;

  @ApiProperty({ description: 'The content of the note' })
  @IsNotEmpty()
  @IsString({ message: 'Content must be a string' })
  content: string;
}