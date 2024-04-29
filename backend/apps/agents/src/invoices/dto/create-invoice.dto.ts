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

export class CreateInvoiceDto {
  @IsNumber()
  @IsNotEmpty({ message: 'subTotal is required' })
  subTotal: number;

  @IsNumber()
  @IsNotEmpty({ message: 'tax is required' })
  tax: number;

  @IsNumber()
  @IsNotEmpty({ message: 'total is required' })
  total: number;

  @IsOptional()
  @IsEnum(InvoiceStatus, { message: 'status must be a valid enum' })
  status?: InvoiceStatus;

  @IsNumber()
  @IsNotEmpty({ message: 'discount is required' })
  discount: number;

  @IsDateString({ message: 'dueDate must be a valid date string' })
  @IsNotEmpty({ message: 'dueDate is required' })
  dueDate: Date;

  @IsString({ message: 'remarks must be a string' })
  @IsNotEmpty({ message: 'remarks is required' })
  remarks: string;
  
  @IsString({ message: 'customer Name must be a string' })
  @IsNotEmpty({ message: 'customer name is required' })
  customerName: string;

  @IsOptional()
  @ValidateNested({ each: true, message: 'products must be valid' })
  @Type(() => CreateProductInputDTO)
  products?: CreateProductInputDTO[];

  @IsOptional({ message: 'customerId is required'})
  @IsNumber()
  customerId?: number;
}
