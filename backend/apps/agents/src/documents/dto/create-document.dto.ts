import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'File must be string' })
  documentFile?: string;

  @IsOptional()
  @IsString({ message: 'LeadId must be string' })
  leadId: string;

  @IsOptional()
  @IsString({ message: 'CustomerId must be string' })
  customerId: string;
}
