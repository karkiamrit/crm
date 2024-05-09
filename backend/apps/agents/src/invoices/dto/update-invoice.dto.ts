import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateProductInputDTO } from "../../shared/dtos/product.dto";
import { InvoiceStatus } from "../../shared/data/enums/invoice.status.enum";
import { IsFloat } from "@app/common/validators/float.validator";

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

    @IsString({ message: 'customer Name must be a string' })
    @IsOptional()
    customerName: string;
  
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
    product?: UpdateProductInputDTO[];
}
