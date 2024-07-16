import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiPropertyOptional({ description: 'The description of the document' })
  @IsOptional()
  @IsString({ message: 'Description must be string' })
  description?: string;

  @ApiPropertyOptional({ description: 'The remarks for the document' })
  @IsOptional()
  @IsString({ message: 'Remarks must be string' })
  remarks?: string;

  @ApiPropertyOptional({ description: 'The file associated with the document' })
  @IsOptional()
  @IsString({ message: 'File must be string' })
  documentFile?: string;

  @ApiPropertyOptional({ description: 'The task ID associated with the document' })
  @IsOptional()
  @IsString({ message: 'Task Id must be a string' })
  taskId?: string;
}