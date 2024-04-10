import { IsOptional, IsString } from 'class-validator';

export class CreateProductInputDTO {
    @IsOptional()
    @IsString()
    name: string;
}

export class UpdateProductInputDTO {
    @IsOptional()
    @IsString()
    name?: string;
}