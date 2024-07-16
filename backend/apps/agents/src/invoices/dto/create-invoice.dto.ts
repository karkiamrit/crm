import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductInputDTO } from '../../shared/dtos/product.dto';
import { Type } from 'class-transformer';
import { IsDateString } from '@app/common/validators/date.validator';
import { InvoiceStatus } from '../../shared/data/enums/invoice.status.enum';
import { IsFloat } from '@app/common/validators/float.validator';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'The subtotal of the invoice' })
  @IsNumber()
  @IsFloat({ message: 'subtotal must be a float' })
  @IsNotEmpty({ message: 'subTotal is required' })
  subTotal: number;

  @ApiProperty({ description: 'The tax of the invoice' })
  @IsNumber()
  @IsFloat({ message: 'discount must be a float' })
  @IsNotEmpty({ message: 'tax is required' })
  tax: number;

  @ApiProperty({ description: 'The total of the invoice' })
  @IsNumber()
  @IsFloat({ message: 'total must be a float' })
  @IsNotEmpty({ message: 'total is required' })
  total: number;

  @ApiPropertyOptional({ description: 'The status of the invoice', enum: InvoiceStatus })
  @IsOptional()
  @IsEnum(InvoiceStatus, { message: 'status must be a valid enum' })
  status?: InvoiceStatus;

  @ApiProperty({ description: 'The discount of the invoice' })
  @IsNumber()
  @IsFloat({ message: 'discount must be a float' })
  @IsNotEmpty({ message: 'discount is required' })
  discount: number;

  @ApiProperty({ description: 'The due date of the invoice' })
  @IsDateString({ message: 'dueDate must be a valid date string' })
  @IsNotEmpty({ message: 'dueDate is required' })
  dueDate: Date;

  @ApiProperty({ description: 'The remarks of the invoice' })
  @IsString({ message: 'remarks must be a string' })
  @IsNotEmpty({ message: 'remarks is required' })
  remarks: string;

  @ApiProperty({ description: 'The lead name of the invoice' })
  @IsString({ message: 'lead Name must be a string' })
  @IsNotEmpty({ message: 'lead name is required' })
  leadName: string;

  @ApiProperty({ description: 'The lead email of the invoice' })
  @IsString({ message: 'lead Email must be a string' })
  @IsNotEmpty({ message: 'lead Email is required' })
  leadEmail: string;

  @ApiProperty({ description: 'The lead organization of the invoice' })
  @IsString({ message: 'lead Org must be a string' })
  @IsNotEmpty({ message: 'lead Org is required' })
  leadOrganization: string;

  @ApiProperty({ description: 'The sender name of the invoice' })
  @IsString({ message: 'lead Email must be a string' })
  @IsNotEmpty({ message: 'lead Email is required' })
  sendorName: string;

  @ApiProperty({ description: 'The sender email of the invoice' })
  @IsString({ message: 'lead Email must be a string' })
  @IsNotEmpty({ message: 'lead Email is required' })
  sendorEmail: string;

  @ApiPropertyOptional({ description: 'The sender organization of the invoice' })
  @IsString({ message: 'lead Email must be a string' })
  @IsOptional({ message: 'lead Email is required' })
  sendorOrganization?: string;

  @ApiPropertyOptional({ description: 'The products of the invoice', type: [CreateProductInputDTO] })
  @IsOptional()
  @ValidateNested({ each: true, message: 'products must be valid' })
  @Type(() => CreateProductInputDTO)
  products?: CreateProductInputDTO[];

  @ApiPropertyOptional({ description: 'The lead id of the invoice' })
  @IsOptional()
  @IsNumber({}, { message: 'lead Id should be a number' })
  leadId?: number;

  @ApiPropertyOptional({ description: 'The image of the invoice' })
  @IsOptional()
  @IsString({message: 'Profile Picture must be a string'})
  image: string;

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