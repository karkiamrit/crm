import { IsOptional, IsString } from 'class-validator';

export class CreateServiceInputDTO {
    @IsOptional()
    @IsString()
    name: string;
}

export class UpdateServiceInputDTO {
    @IsOptional()
    @IsString()
    name?: string;
}