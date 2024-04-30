import { IsOptional, IsString } from 'class-validator';

export class CreateServiceInputDTO {
    @IsOptional()
    @IsString({ message: 'Name must be a string'})
    name: string;
}

export class UpdateServiceInputDTO {
    @IsOptional()
    @IsString({ message: 'Name must be a string'})
    name?: string;
}