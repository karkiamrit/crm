import { IsFloat } from '@app/common/validators/float.validator';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating a Listing
 */
export class UpdateListingsDto {
  @IsString({ message: 'Name must be string' })
  @IsOptional()
  name?: string;

  @IsNumber({}, { message: 'Price must be string' })
  @IsOptional()
  price?: number;

  @IsString({ message: 'Property Type must be string' })
  @IsOptional()
  propertyType?: string;

  @IsString({ message: 'Offer Type must be string' })
  @IsOptional()
  offerType?: string;

  @IsNumber({}, { message: 'Floor must be string' })
  @IsOptional()
  floor?: number;

  @IsFloat({ message: 'Building Area must be float' })
  @IsOptional()
  buildingArea?: number;

  @IsFloat({ message: 'Surface Area must be float' })
  @IsOptional()
  surfaceArea?: number;

  @IsString({ message: 'Status must be string' })
  @IsOptional()
  status?: string;

  @IsString({ message: 'Listing Address must be string' })
  @IsOptional()
  listingAddress?: string;

  @IsString({ message: 'Listing City must be string' })
  @IsOptional()
  listingCity?: string;
}
