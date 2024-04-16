import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductInputDTO {
    @IsOptional()
    @IsString({ message: 'name must be a string' })
    name?: string;
  
    @IsOptional()
    @IsString({ message: 'description must be a string' })
    description?: string;
  
    @IsOptional()
    @IsNumber()
    quantity?: number;
  
    @IsOptional()
    @IsNumber()
    price?: number;
  
    @IsOptional()
    @IsNumber()
    total?: number;
}

export class UpdateProductInputDTO {
    @IsOptional()
    @IsString({ message: 'name must be a string' })
    name?: string;
  
    @IsOptional()
    @IsString({ message: 'description must be a string' })
    description?: string;
  
    @IsOptional()
    @IsNumber()
    quantity?: number;
  
    @IsOptional()
    @IsNumber()
    price?: number;
  
    @IsOptional()
    @IsNumber()
    total?: number;
}
