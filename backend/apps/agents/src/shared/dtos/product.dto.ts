import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidationOptions,
} from 'class-validator';

export class CreateProductInputDTO {
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Validate(ifNotNumber, { message: 'Quantity must be a number' })
  quantity?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Prive must be a number' })
  @Validate(ifNotNumber, { message: '{Price} must be a number' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Total must be a number' })
  @Validate(ifNotNumber, { message: 'Total must be a number' })
  total?: number;
}

export class UpdateProductInputDTO {
  @IsOptional()
  @IsNumber({}, { message: 'Id must be a number' })
  id: number;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Validate(ifNotNumber, { message: 'Quantity must be a number' })
  quantity?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Prive must be a number' })
  @Validate(ifNotNumber, { message: '{Price} must be a number' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Total must be a number' })
  @Validate(ifNotNumber, { message: 'Total must be a number' })
  total?: number;
}

export function ifNotNumber(
  value: any,
  validationArguments?: ValidationOptions,
) {
  return typeof value === 'number' || value === undefined;
}
