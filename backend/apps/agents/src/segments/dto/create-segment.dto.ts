import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateSegmentDto {
  @ApiProperty({ description: 'The name of the segment' })
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'The description of the segment', required: false })
  @IsString({ message: 'Description must be string' })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The leads of the segment', required: false, type: [Number] })
  @IsArray({ message: 'Leads must be an array' })
  @IsOptional()
  leads: number[];

  @ApiProperty({ description: 'The customers of the segment', required: false, type: [Number] })
  @IsArray({ message: 'Leads must be an array' })
  @IsOptional()
  customers: number[];
}

export class CreateFromLeadDto {
  @ApiProperty({ description: 'The name of the lead' })
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'The ID of the lead' })
  @IsNumber()
  @IsNotEmpty({ message: 'LeadId is required' })
  leadId: number;
}

export class CreateFromCustomerDto {
  @ApiProperty({ description: 'The name of the customer' })
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'The ID of the customer' })
  @IsNumber()
  @IsNotEmpty({ message: 'customerId is required' })
  customerId: number;
}