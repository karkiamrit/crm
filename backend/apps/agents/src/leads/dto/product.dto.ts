import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductInputDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateProductInputDTO {
    @IsOptional()
    @IsString()
    name?: string;
}