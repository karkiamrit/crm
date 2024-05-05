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
import { LeadType } from '../../shared/data';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString({ message: 'Address Must be a String'})
  address?: string;

  @IsOptional()
  @IsString({ message: 'Revenue Potential must be string'})
  revenuePotential?: number;

  @IsOptional()
  @IsEnum(LeadType, { message: 'Type must be a valid type'})
  type?: LeadType;

  @IsOptional()
  @IsString({ message: 'Details Must be a String' })
  details?: string;

  @IsOptional()
  @IsString({ message: 'Phone Must be a String'})
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Email Must be a String'})
  email?: string;

  @IsOptional()
  @IsString({ message: 'Name Must be a String'})
  name?: string;

  @IsOptional()
  @IsString({ message: 'Source Must be a String'})
  source?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductInputDTO)
  product?: UpdateProductInputDTO;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateServiceInputDTO)
  service?: UpdateServiceInputDTO;

  @IsOptional()
  @IsString({ message: 'Profile Picture Must be a String'})
  profilePicture?: string;
  // @IsOptional()
  // @IsArray()
  // @IsString({each:true})
  // documents: string[];
}
