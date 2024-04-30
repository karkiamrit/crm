import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

import { Type } from "class-transformer";
import { UpdateProductInputDTO } from "../../shared/dtos/product.dto";
import { UpdateServiceInputDTO } from "../../shared/dtos/service.dto";
import { LeadsStatus, LeadType } from "../../shared/data";


export class UpdateLeadDto {
    @IsOptional()
    @IsString({ message: 'Name is not valid'})
    address?: string;

    @IsOptional()
    @IsString({ message: 'Details is not valid'})
    details?: string;

    @IsOptional()
    @IsEnum(LeadsStatus,{ message: 'Status is not valid'})
    status?: LeadsStatus;

    @IsOptional()
    @IsEnum(LeadType, { message: 'Type is not valid'})
    type?: LeadType;

    @IsOptional()
    @IsString({ message: 'Phone is not valid'})
    phone?: string;

    @IsOptional()
    @IsString({message: "Email must be string"})
    email?: string;

    @IsOptional()
    @IsString({ message: 'Name is not valid'})
    name?: string;

    @IsOptional()
    @IsNumber()
    revenuePotential?: number;

    @IsOptional()
    @IsString({message: 'Source must be string'})
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
    @IsString({message: "Profile picture must be string"})
    profilePicture: string;
}