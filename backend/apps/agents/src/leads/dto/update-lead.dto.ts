import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

import { Type } from "class-transformer";
import { UpdateProductInputDTO } from "../../shared/dtos/product.dto";
import { UpdateServiceInputDTO } from "../../shared/dtos/service.dto";
import { LeadsStatus, LeadType } from "../../shared/data";


export class UpdateLeadDto {
    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    details?: string;

    @IsOptional()
    @IsEnum(LeadsStatus)
    status?: LeadsStatus;

    @IsOptional()
    @IsEnum(LeadType)
    type?: LeadType;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    priority?: number;

    @IsOptional()
    @IsString()
    source?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateProductInputDTO)
    product?: UpdateProductInputDTO;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateServiceInputDTO)
    service?: UpdateServiceInputDTO;

    @IsOptional()
    @IsString()
    profilePicture: string;
}