import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateProductInputDTO } from "../../shared/dtos/product.dto";

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
  
    @IsNumber()
    @IsOptional()
    discount?: number;
  
    @IsDate()
    @IsOptional()
    dueDate?: Date;
  
    @IsString()
    @IsOptional()
    remarks?: string;
  
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateProductInputDTO)
    product?: UpdateProductInputDTO[];
}
