import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


import { Type } from "class-transformer";
import { CreateProductInputDTO } from "../../shared/dtos/product.dto";
import { CreateServiceInputDTO } from "../../shared/dtos/service.dto";
import { LeadsStatus, LeadType } from "../../shared/data";


export class CreateLeadDto {
    @IsOptional()
    @IsString({ message: 'Name must be string'})
    address?: string;

    @IsOptional()
    @IsString({ message: 'Details must be string'})
    details?: string;

    @IsOptional()
    @IsString({ message: 'Revenue Potential must be string'})
    revenuePotential?: string;

    @IsOptional()
    @IsEnum(LeadsStatus, { message: 'Status must be valid'})
    status?: LeadsStatus;

    @IsOptional()
    @IsEnum(LeadType, {message: 'Lead type must be valid'})
    type?: LeadType;

    @IsNotEmpty({ message: 'Phone number is required'})
    @IsString({ message: 'Phone number must be string'})
    phone: string;

    @IsNotEmpty({ message: 'Email is required'})
    @IsString({message: 'Email must be string'})
    email: string;

    @IsNotEmpty({ message: 'Name is required'})
    @IsString({message: "Name shoule be string"})
    name: string;

    @IsOptional()
    @IsString({ message: 'Source must be string'})
    source?: string;

    @IsOptional()
    @IsString({ message: 'Segment must be string'})
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
    @IsString({ message: 'Profile picture must be string'})
    profilePicture?: string;
}
