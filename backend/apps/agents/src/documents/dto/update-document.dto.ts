import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDocumentDto {
  @ApiPropertyOptional({ example: 'Document1', description: 'The name of the document' })
  @IsOptional()
  @IsString({ message: 'Name must be string' })
  name?: string;

  @ApiPropertyOptional({ example: 'http://example.com/document.pdf', description: 'The file URL of the document' })
  @IsOptional()
  @IsString({ message: 'Document File must be string' })
  documentFile?: string;

  @ApiPropertyOptional({ example: 'User1', description: 'The user who created the document' })
  @IsOptional()
  @IsString({ message: 'Created By must be string' })
  createdBy?: string;

  @ApiPropertyOptional({ example: 1, description: 'The ID of the user' })
  @IsOptional()
  @IsNumber({}, { message: 'User ID must be a number' })
  userId?: number;
}