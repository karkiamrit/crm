import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDocumentDto {

  @IsOptional()
  @IsString({message: 'Description must be string'})
  description?: string;

  @IsOptional()
  @IsString({message: 'Remarks must be string'})
  remarks?: string;

  @IsOptional()
  @IsString({message: 'File must be string'}) 
  documentFile?: string;

  @IsOptional()
  @IsString({message: 'Task Id must be a string'}) 
  taskId?: string;

}