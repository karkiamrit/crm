import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateProductInputDTO } from "../../shared/dtos/product.dto";
import { InvoiceStatus } from "../../shared/data/enums/invoice.status.enum";

export class UpdateInvoiceDto {
    @IsNumber()
    @IsOptional()
    subTotal?: number;
  
    @IsNumber()
    @IsOptional()
    tax?: number;
  
    @IsNumber()
    @IsOptional()
    total?: number;

    @IsString({ message: 'customer Name must be a string' })
    @IsOptional()
    customerName: string;
  
    @IsNumber()
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
    product?: UpdateProductInputDTO[];
}
