import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { CreateProductInputDTO } from '../../shared/dtos/product.dto';
import { CreateServiceInputDTO } from '../../shared/dtos/service.dto';
import { LeadsStatus, LeadType } from '../../shared/data';

export class CreateLeadDto {
  @ApiPropertyOptional({ description: 'The address of the lead' })
  @IsOptional()
  @IsString({ message: 'Name must be string' })
  address?: string;

  @ApiPropertyOptional({ description: 'The details of the lead' })
  @IsOptional()
  @IsString({ message: 'Details must be string' })
  details?: string;

  @ApiPropertyOptional({ description: 'The revenue potential of the lead' })
  @IsOptional()
  @IsString({ message: 'Revenue Potential must be string' })
  revenuePotential?: string;

  @ApiPropertyOptional({ description: 'The status of the lead', enum: LeadsStatus })
  @IsOptional()
  @IsEnum(LeadsStatus, { message: 'Status must be valid' })
  status?: LeadsStatus;

  @ApiPropertyOptional({ description: 'The type of the lead', enum: LeadType })
  @IsOptional()
  @IsEnum(LeadType, { message: 'Lead type must be valid' })
  type?: LeadType;

  @ApiProperty({ description: 'The phone number of the lead' })
  @IsOptional({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be string' })
  phone: string;

  @ApiProperty({ description: 'The email of the lead' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be string' })
  email: string;

  @ApiProperty({ description: 'The name of the lead' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name should be string' })
  name: string;

  @ApiPropertyOptional({ description: 'The source of the lead' })
  @IsOptional()
  @IsString({ message: 'Source must be string' })
  source?: string;

  @ApiPropertyOptional({ description: 'The segment of the lead' })
  @IsOptional()
  @IsString({ message: 'Segment must be string' })
  segment?: string;

  @ApiPropertyOptional({ description: 'The product of the lead', type: CreateProductInputDTO })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductInputDTO)
  product: CreateProductInputDTO;

  @ApiPropertyOptional({ description: 'The service of the lead', type: CreateServiceInputDTO })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceInputDTO)
  service?: CreateServiceInputDTO;

  @ApiPropertyOptional({ description: 'The profile picture of the lead' })
  @IsOptional()
  @IsString({ message: 'Profile picture must be string' })
  profilePicture?: string;

  @ApiPropertyOptional({ description: 'The tags of the lead', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class LeadImportDto {
  @ApiPropertyOptional({ description: 'The segment ID of the lead' })
  @IsOptional()
  @IsNumber()
  segmentId: number;

  @ApiPropertyOptional({ description: 'The status of the lead', enum: LeadsStatus })
  @IsOptional()
  @IsEnum(LeadsStatus, { message: 'Status must be valid' })
  status?: LeadsStatus;
}