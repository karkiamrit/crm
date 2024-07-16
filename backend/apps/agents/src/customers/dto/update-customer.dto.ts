import { IsOptional, IsString, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateProductInputDTO } from '../../shared/dtos/product.dto';
import { UpdateServiceInputDTO } from '../../shared/dtos/service.dto';
import { LeadType } from '../../shared/data';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: '123 Main St', description: 'The address of the customer' })
  @IsOptional()
  @IsString({ message: 'Address Must be a String' })
  address?: string;

  @ApiPropertyOptional({ example: 10000, description: 'The revenue potential of the lead' })
  @IsOptional()
  @IsNumber({}, { message: 'Revenue Potential must be a number' })
  revenuePotential?: number;

  @ApiPropertyOptional({ example: LeadType.SOLE, description: 'The type of the lead' })
  @IsOptional()
  @IsEnum(LeadType, { message: 'Type must be a valid type' })
  type?: LeadType;

  @ApiPropertyOptional({ example: 'Additional customer details', description: 'Additional details about the customer' })
  @IsOptional()
  @IsString({ message: 'Details Must be a String' })
  details?: string;

  @ApiPropertyOptional({ example: '1234567890', description: 'The phone number of the customer' })
  @IsOptional()
  @IsString({ message: 'Phone Must be a String' })
  phone?: string;

  @ApiPropertyOptional({ example: 'customer@example.com', description: 'The email of the customer' })
  @IsOptional()
  @IsString({ message: 'Email Must be a String' })
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'The name of the customer' })
  @IsOptional()
  @IsString({ message: 'Name Must be a String' })
  name?: string;

  @ApiPropertyOptional({ example: 'Online', description: 'The source of the lead' })
  @IsOptional()
  @IsString({ message: 'Source Must be a String' })
  source?: string;

  @ApiPropertyOptional({ type: UpdateProductInputDTO, description: 'The product associated with the customer' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductInputDTO)
  product?: UpdateProductInputDTO;

  @ApiPropertyOptional({ type: UpdateServiceInputDTO, description: 'The service associated with the customer' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateServiceInputDTO)
  service?: UpdateServiceInputDTO;

  @ApiPropertyOptional({ example: 'http://example.com/profile.jpg', description: 'The profile picture of the customer' })
  @IsOptional()
  @IsString({ message: 'Profile Picture Must be a String' })
  profilePicture?: string;
}