import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString({ message: 'Name must be string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Document File must be string' })
  documentFile?: string;

  @IsOptional()
  @IsString({ message: 'Created By must be string' })
  createdBy?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
