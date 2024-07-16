import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Document1', description: 'The name of the document' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be string' })
  name: string;

  @ApiPropertyOptional({ example: 'This is a sample document', description: 'The description of the document' })
  @IsOptional()
  @IsString({ message: 'Description must be string' })
  description?: string;

  @ApiPropertyOptional({ example: 'http://example.com/document.pdf', description: 'The file URL of the document' })
  @IsOptional()
  @IsString({ message: 'File must be string' })
  documentFile?: string;

  @ApiPropertyOptional({ example: 'lead123', description: 'The ID of the associated lead' })
  @IsOptional()
  @IsString({ message: 'LeadId must be string' })
  leadId: string;

  @ApiPropertyOptional({ example: 'customer123', description: 'The ID of the associated customer' })
  @IsOptional()
  @IsString({ message: 'CustomerId must be string' })
  customerId: string;
}