import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { LeadsStatus } from "../entities/lead.entity";

import { Type } from "class-transformer";
import { CreateProductInputDTO } from "../../shared/dtos/product.dto";
import { CreateServiceInputDTO } from "../../shared/dtos/service.dto";


export class CreateLeadDto {
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    details: string;

    @IsOptional()
    @IsEnum(LeadsStatus)
    status: LeadsStatus;

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
