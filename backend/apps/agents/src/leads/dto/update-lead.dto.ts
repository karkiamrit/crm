import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { UpdateProductInputDTO } from '../../shared/dtos/product.dto';
import { UpdateServiceInputDTO } from '../../shared/dtos/service.dto';
import { LeadsStatus, LeadType } from '../../shared/data';

export class UpdateLeadDto {
  @ApiPropertyOptional({ description: 'The address of the lead' })
  @IsOptional()
  @IsString({ message: 'Name is not valid' })
  address?: string;

  @ApiPropertyOptional({ description: 'The details of the lead' })
  @IsOptional()
  @IsString({ message: 'Details is not valid' })
  details?: string;

  @ApiPropertyOptional({ description: 'The status of the lead', enum: LeadsStatus })
  @IsOptional()
  @IsEnum(LeadsStatus, { message: 'Status is not valid' })
  status?: LeadsStatus;

  @ApiPropertyOptional({ description: 'The type of the lead', enum: LeadType })
  @IsOptional()
  @IsEnum(LeadType, { message: 'Type is not valid' })
  type?: LeadType;

  @ApiPropertyOptional({ description: 'The phone number of the lead' })
  @IsOptional()
  @IsString({ message: 'Phone is not valid' })
  phone?: string;

  @ApiPropertyOptional({ description: 'The email of the lead' })
  @IsOptional()
  @IsString({ message: 'Email must be string' })
  email?: string;

  @ApiPropertyOptional({ description: 'The name of the lead' })
  @IsOptional()
  @IsString({ message: 'Name is not valid' })
  name?: string;

  @ApiPropertyOptional({ description: 'The revenue potential of the lead' })
  @IsOptional()
  @IsNumber({}, { message: 'Revenue Potential must be number' })
  revenuePotential?: number;

  @ApiPropertyOptional({ description: 'The source of the lead' })
  @IsOptional()
  @IsString({ message: 'Source must be string' })
  source?: string;

  @ApiPropertyOptional({ description: 'The updated time of the lead', type: 'string', format: 'date-time' })
  @IsOptional()
  updatedTime?: Date;

  @ApiPropertyOptional({ description: 'The product of the lead', type: UpdateProductInputDTO })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductInputDTO)
  product?: UpdateProductInputDTO;

  @ApiPropertyOptional({ description: 'The service of the lead', type: UpdateServiceInputDTO })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateServiceInputDTO)
  service?: UpdateServiceInputDTO;

  @ApiPropertyOptional({ description: 'The tags of the lead', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}