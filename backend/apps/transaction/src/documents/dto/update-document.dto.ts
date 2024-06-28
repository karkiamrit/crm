import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { DocumentStatus } from './enums/status.enum';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString({ message: 'Description must be string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Document File must be string' })
  documentFile?: string;

  @IsOptional()
  @IsString({ message: 'Created By must be string' })
  createdBy?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsEnum(DocumentStatus, { message: 'Invalid status' })
  @IsOptional()
  status?: DocumentStatus;

  @IsOptional()
  @IsString({ message: 'Remarks must be string' })
  remarks?: string;
}
