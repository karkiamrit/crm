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


  @IsArray({message: 'Leads must be an array'})
  @IsOptional()
  customers: number[];

}

export class CreateFromLeadDto{
  @IsString({message: 'Name must be string'})
  @IsNotEmpty({message: 'Name is required'})
  name: string;

  @IsNumber()
  @IsNotEmpty({message: 'LeadId is required'})
  leadId: number;
}

export class CreateFromCustomerDto{
  @IsString({message: 'Name must be string'})
  @IsNotEmpty({message: 'Name is required'})
  name: string;

  @IsNumber()
  @IsNotEmpty({message: 'customerId is required'})
  customerId: number;
}