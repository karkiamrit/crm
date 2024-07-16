import { IsOptional, IsString, IsNotEmpty, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductInputDTO } from '../../shared/dtos/product.dto';
import { CreateServiceInputDTO } from '../../shared/dtos/service.dto';
import { LeadType } from '../../shared/data';

export class CreateCustomerDto {
  @ApiProperty({ example: '123 Main St', description: 'The address of the customer' })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address: string;

  @ApiProperty({ example: 'Additional customer details', description: 'Additional details about the customer' })
  @IsOptional()
  @IsString({ message: 'Details must be a string' })
  details: string;

  @ApiProperty({ example: '1234567890', description: 'The phone number of the customer' })
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  phone: string;

  @ApiProperty({ example: 'customer@example.com', description: 'The email of the customer' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the customer' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ example: LeadType.ORGANIZATION, description: 'The type of the lead' })
  @IsOptional()
  @IsEnum(LeadType, { message: 'Type must be a valid lead type' })
  type?: LeadType;

  @ApiProperty({ example: 'Online', description: 'The source of the lead' })
  @IsOptional()
  @IsString({ message: 'Source must be a string' })
  source: string;

  @ApiProperty({ example: 10000, description: 'The revenue potential of the lead' })
  @IsOptional()
  @IsNumber({}, { message: 'Revenue Potential must be a number' })
  revenuePotential?: number;

  @ApiProperty({ type: CreateProductInputDTO, description: 'The product associated with the customer' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductInputDTO)
  product: CreateProductInputDTO;

  @ApiProperty({ type: CreateServiceInputDTO, description: 'The service associated with the customer' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceInputDTO)
  service: CreateServiceInputDTO;

  @ApiProperty({ example: 'http://example.com/profile.jpg', description: 'The profile picture of the customer' })
  @IsOptional()
  @IsString({ message: 'Profile picture must be a string' })
  profilePicture?: string;
}

export class CustomerImportDto {
  @ApiProperty({ example: 1, description: 'The segment id for customer import' })
  @IsOptional()
  @IsNumber()
  segmentId: number;
}