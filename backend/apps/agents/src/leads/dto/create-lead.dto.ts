import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { LeadsStatus } from "../entities/lead.entity";
import { CreateProductInputDTO } from "./product.dto";
import { Type } from "class-transformer";
import { CreateServiceInputDTO } from "./service.dto";
import { CreateTimelineInputDTO } from "./timeline.dto";

export class CreateLeadDto {
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    details: string;

    @IsNotEmpty()
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

    @IsNotEmpty()
    @IsNumber()
    priority: number;

    @IsNotEmpty()
    @IsString()
    source: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateProductInputDTO)
    product: CreateProductInputDTO;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceInputDTO)
    service: CreateServiceInputDTO;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    documents: string[];

}
