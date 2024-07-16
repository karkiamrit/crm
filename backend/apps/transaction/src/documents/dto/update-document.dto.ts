import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { DocumentStatus } from './enums/status.enum';

export class UpdateDocumentDto {
  @ApiPropertyOptional({ description: 'The description of the document' })
  @IsOptional()
  @IsString({ message: 'Description must be string' })
  description?: string;

  @ApiPropertyOptional({ description: 'The file associated with the document' })
  @IsOptional()
  @IsString({ message: 'Document File must be string' })
  documentFile?: string;

  @ApiPropertyOptional({ description: 'The user who created the document' })
  @IsOptional()
  @IsString({ message: 'Created By must be string' })
  createdBy?: string;

  @ApiPropertyOptional({ description: 'The ID of the user who created the document' })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({ description: 'The status of the document', enum: DocumentStatus })
  @IsEnum(DocumentStatus, { message: 'Invalid status' })
  @IsOptional()
  status?: DocumentStatus;

  @ApiPropertyOptional({ description: 'The remarks for the document' })
  @IsOptional()
  @IsString({ message: 'Remarks must be string' })
  remarks?: string;
}