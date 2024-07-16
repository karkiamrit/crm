import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateProductInputDTO } from '../../shared/dtos/product.dto';
import { InvoiceStatus } from '../../shared/data/enums/invoice.status.enum';
import { IsFloat } from '@app/common/validators/float.validator';

export class UpdateInvoiceDto {
  @ApiPropertyOptional({ description: 'The subtotal of the invoice' })
  @IsNumber()
  @IsFloat({ message: 'subtotal must be a float' })
  @IsOptional()
  subTotal?: number;

  @ApiPropertyOptional({ description: 'The tax of the invoice' })
  @IsNumber()
  @IsFloat({ message: 'tax must be a float' })
  @IsOptional()
  tax?: number;

  @ApiPropertyOptional({ description: 'The total of the invoice' })
  @IsNumber()
  @IsFloat({ message: 'total must be a float' })
  @IsOptional()
  total?: number;

  @ApiPropertyOptional({ description: 'The lead name of the invoice' })
  @IsString({ message: 'lead Name must be a string' })
  @IsOptional()
  leadName?: string;

  @ApiPropertyOptional({ description: 'The lead email of the invoice' })
  @IsString({ message: 'lead Name must be a string' })
  @IsOptional({ message: 'lead name is optional' })
  leadEmail?: string;

  @ApiPropertyOptional({ description: 'The lead organization of the invoice' })
  @IsString({ message: 'lead Org must be a string' })
  @IsOptional({ message: 'lead Org is required' })
  leadOrganization: string;

  @ApiPropertyOptional({ description: 'The sender name of the invoice' })
  @IsString({ message: 'lead Email must be a string' })
  @IsOptional({ message: 'lead Email is required' })
  sendorName: string;

  @ApiPropertyOptional({ description: 'The sender email of the invoice' })
  @IsString({ message: 'lead Email must be a string' })
  @IsOptional({ message: 'lead Email is required' })
  sendorEmail: string;

  @ApiPropertyOptional({ description: 'The sender organization of the invoice' })
  @IsString({ message: 'lead Email must be a string' })
  @IsOptional({ message: 'lead Email is required' })
  sendorOrganization?: string;

  @ApiPropertyOptional({ description: 'The discount of the invoice' })
  @IsNumber()
  @IsFloat({ message: 'discount must be a float' })
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({ description: 'The due date of the invoice' })
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'The status of the invoice', enum: InvoiceStatus })
  @IsOptional()
  @IsEnum(InvoiceStatus, { message: 'status must be a valid enum' })
  status: InvoiceStatus;

  @ApiPropertyOptional({ description: 'The remarks of the invoice' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ description: 'The products of the invoice', type: [UpdateProductInputDTO] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductInputDTO)
  products?: UpdateProductInputDTO[];

  @ApiPropertyOptional({ description: 'The lead address of the invoice' })
  @IsOptional()
  @IsString({ message: 'lead Address must be a string' })
  leadAddress: string;

  @ApiPropertyOptional({ description: 'The lead country of the invoice' })
  @IsOptional()
  @IsString({ message: 'lead Country must be a string' })
  leadCountry: string;

  @ApiPropertyOptional({ description: 'The sender address of the invoice' })
  @IsOptional()
  @IsString({ message: 'Sender Address must be a string' })
  sendorAddress: string;

  @ApiPropertyOptional({ description: 'The sender country of the invoice' })
  @IsOptional()
  @IsString({ message: 'Sender Country must be a string' })
  sendorCountry: string;
}