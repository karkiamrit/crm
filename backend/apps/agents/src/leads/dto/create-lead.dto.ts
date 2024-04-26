import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


import { Type } from "class-transformer";
import { CreateProductInputDTO } from "../../shared/dtos/product.dto";
import { CreateServiceInputDTO } from "../../shared/dtos/service.dto";
import { LeadsStatus, LeadType } from "../../shared/data";


export class CreateLeadDto {
    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    details?: string;

    @IsOptional()
    @IsString()
    revenuePotential?: string;

    @IsOptional()
    @IsEnum(LeadsStatus)
    status?: LeadsStatus;

    @IsOptional()
    @IsEnum(LeadType)
    type?: LeadType;

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
    @IsString()
    source?: string;

    @IsOptional()
    @IsString()
    segment?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateProductInputDTO)
    product: CreateProductInputDTO;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceInputDTO)
    service?: CreateServiceInputDTO;

    @IsOptional()
    @IsString()
    profilePicture?: string;
}
