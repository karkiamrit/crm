import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateProductInputDTO } from "../../shared/dtos/product.dto";
import { CreateServiceInputDTO } from "../../shared/dtos/service.dto";
import { LeadType } from "../../shared/data";


export class CreateCustomerDto {
    @IsOptional()
    @IsString({ message: 'Address must be a string'})
    address: string;

    @IsOptional()
    @IsString({ message: 'Details must be a string'})
    details: string;

    @IsNotEmpty({ message: 'Phone is required'})
    @IsString({ message: 'Phone must be a string'})
    phone: string;

    @IsNotEmpty({ message: 'Email is required'})
    @IsString({ message: 'Email must be a string'})
    email: string;

    @IsNotEmpty({ message: 'Name is required'})
    @IsString({ message: 'Name must be a string'})
    name: string;

    @IsOptional()
    @IsEnum(LeadType, { message: 'Type must be a valid lead type'})
    type?: LeadType;

    @IsOptional()
    @IsString({ message: 'Source must be a string'})
    source: string;

    @IsOptional()
    @IsString({ message: 'Revenue Potential must be string'})
    revenuePotential?: number;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateProductInputDTO)
    product: CreateProductInputDTO;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceInputDTO)
    service: CreateServiceInputDTO;

    @IsOptional()
    @IsString({ message: 'Profile picture must be a string'})
    profilePicture?: string;
    // @IsOptional()
    // @IsArray()
    // @IsString({each:true})
    // documents: string[];
}
