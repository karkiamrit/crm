import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateSegmentDto {
    @IsString({ message: 'Name must be a string'})
    @IsOptional()
    name: string;

    @IsString({ message: 'Description must be a string'})
    @IsNotEmpty()
    description: string;
  }

  export class AddLeadsToSegmentDto {
    @IsArray({ message: 'LeadIds must be an array'})
    @IsNumber({}, { each: true })
    leadIds: number[];
  }

  export class AddCustomersToSegmentDto {
    @IsArray({ message: 'customers must be an array'})
    @IsNumber({}, { each: true })
    customerIds: number[];
  }