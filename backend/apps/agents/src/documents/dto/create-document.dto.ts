import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString() 
  documentFile?: string;

  @IsNotEmpty()
  @IsString()
  leadId: string;
}