import {
  IsDate,
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
  @IsNumber()
  @IsFloat({ message: 'subtotal must be a float' })
  @IsNotEmpty({ message: 'subTotal is required' })
  subTotal: number;

  @IsNumber()
  @IsFloat({ message: 'discount must be a float' })
  @IsNotEmpty({ message: 'tax is required' })
  tax: number;

  @IsNumber()
  @IsFloat({ message: 'total must be a float' })
  @IsNotEmpty({ message: 'total is required' })
  total: number;

  @IsOptional()
  @IsEnum(InvoiceStatus, { message: 'status must be a valid enum' })
  status?: InvoiceStatus;

  @IsNumber()
  @IsFloat({ message: 'discount must be a float' })
  @IsNotEmpty({ message: 'discount is required' })
  discount: number;

  @IsDateString({ message: 'dueDate must be a valid date string' })
  @IsNotEmpty({ message: 'dueDate is required' })
  dueDate: Date;

  @IsString({ message: 'remarks must be a string' })
  @IsNotEmpty({ message: 'remarks is required' })
  remarks: string;

  @IsString({ message: 'lead Name must be a string' })
  @IsNotEmpty({ message: 'lead name is required' })
  leadName: string;

  @IsString({ message: 'lead Email must be a string' })
  @IsNotEmpty({ message: 'lead Email is required' })
  leadEmail: string;

  @IsString({ message: 'lead Org must be a string' })
  @IsNotEmpty({ message: 'lead Org is required' })
  leadOrganization: string;

  @IsString({ message: 'lead Email must be a string' })
  @IsNotEmpty({ message: 'lead Email is required' })
  sendorName: string;

  @IsString({ message: 'lead Email must be a string' })
  @IsNotEmpty({ message: 'lead Email is required' })
  sendorEmail: string;

  @IsString({ message: 'lead Email must be a string' })
  @IsOptional({ message: 'lead Email is required' })
  sendorOrganization?: string;

  // @IsString({ message: 'lead Name must be a string' })
  // @IsOptional({ message: 'lead name is optional' })
  // customerEmail: string;

  @IsOptional()
  @ValidateNested({ each: true, message: 'products must be valid' })
  @Type(() => CreateProductInputDTO)
  products?: CreateProductInputDTO[];

  @IsOptional()
  @IsNumber({}, { message: 'lead Id should be a number' })
  leadId?: number;
}
