import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceInputDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateServiceInputDTO {
    @IsOptional()
    @IsString()
    name?: string;
}