import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UpdateSegmentDto {
  @ApiPropertyOptional({ description: 'The name of the segment' })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: 'The description of the segment' })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description: string;
}

export class AddLeadsToSegmentDto {
  @ApiPropertyOptional({ description: 'The lead IDs to add to the segment', type: [Number] })
  @IsArray({ message: 'LeadIds must be an array' })
  @IsNumber({}, { each: true })
  @IsOptional()
  leadIds: number[];
}

export class AddCustomersToSegmentDto {
  @ApiPropertyOptional({ description: 'The customer IDs to add to the segment', type: [Number] })
  @IsArray({ message: 'customers must be an array' })
  @IsNumber({}, { each: true })
  @IsOptional()
  customerIds: number[];
}