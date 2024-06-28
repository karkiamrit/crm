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
  @IsNumber()
  @IsFloat({ message: 'subtotal must be a float' })
  @IsOptional()
  subTotal?: number;

  @IsNumber()
  @IsFloat({ message: 'tax must be a float' })
  @IsOptional()
  tax?: number;

  @IsNumber()
  @IsFloat({ message: 'total must be a float' })
  @IsOptional()
  total?: number;

  @IsString({ message: 'lead Name must be a string' })
  @IsOptional()
  leadName?: string;

  @IsString({ message: 'lead Name must be a string' })
  @IsOptional({ message: 'lead name is optional' })
  leadEmail?: string;

  @IsString({ message: 'lead Org must be a string' })
  @IsOptional({ message: 'lead Org is required' })
  leadOrganization: string;

  @IsString({ message: 'lead Email must be a string' })
  @IsOptional({ message: 'lead Email is required' })
  sendorName: string;

  @IsString({ message: 'lead Email must be a string' })
  @IsOptional({ message: 'lead Email is required' })
  sendorEmail: string;

  @IsString({ message: 'lead Email must be a string' })
  @IsOptional({ message: 'lead Email is required' })
  sendorOrganization?: string;

  @IsNumber()
  @IsFloat({ message: 'discount must be a float' })
  @IsOptional()
  discount?: number;

  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(InvoiceStatus, { message: 'status must be a valid enum' })
  status: InvoiceStatus;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductInputDTO)
  products?: UpdateProductInputDTO[];
}
