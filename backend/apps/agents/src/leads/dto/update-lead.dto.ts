import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { LeadsStatus } from "../entities/lead.entity";
import { UpdateProductInputDTO } from "./product.dto";
import { Type } from "class-transformer";
import { UpdateServiceInputDTO } from "./service.dto";

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

    // @IsOptional()
    // @ValidateNested({ each: true })
    // @Type(() => UpdateTimelineInputDTO)
    // timelines?: UpdateTimelineInputDTO[];

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    documents: string[];
}