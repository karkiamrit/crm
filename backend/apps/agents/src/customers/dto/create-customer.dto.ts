import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateProductInputDTO } from "../../shared/dtos/product.dto";
import { CreateServiceInputDTO } from "../../shared/dtos/service.dto";


export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    details: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    // @IsNumber()
    priority?: number;

    @IsOptional()
    @IsString()
    source: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateProductInputDTO)
    product: CreateProductInputDTO;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceInputDTO)
    service: CreateServiceInputDTO;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    documents: string[];
}
