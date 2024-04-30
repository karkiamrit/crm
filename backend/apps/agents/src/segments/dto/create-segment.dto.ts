import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateSegmentDto {
  @IsString({message: 'Name must be string'})
  @IsNotEmpty({message: 'Name is required'})
  name: string;

  @IsString({message: 'Description must be string'})
  @IsOptional()
  description?: string;

  @IsArray({message: 'Leads must be an array'})
  @IsOptional()
  leads: number[];

}

export class CreateFromLeadDto{
  @IsString({message: 'Name must be string'})
  @IsNotEmpty({message: 'Name is required'})
  name: string;

  @IsNumber()
  @IsNotEmpty({message: 'LeadId is required'})
  leadId: number;
}