import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO for creating a Listing
 */
export class CreateListingsDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Price must be string' })
  @IsNotEmpty()
  price: string;

  @IsString({ message: 'Property Type must be string' })
  @IsNotEmpty()
  propertyType: string;

  @IsString({ message: 'Offer Type must be string' })
  @IsNotEmpty()
  offerType: string;

  @IsString({ message: 'Floor must be string' })
  @IsNotEmpty()
  floor: string;

  @IsString({ message: 'Building Area must be string' })
  @IsNotEmpty()
  buildingArea: string;

  @IsString({ message: 'Surface Area must be string' })
  @IsNotEmpty()
  surfaceArea: string;

  @IsString({ message: 'Status must be string' })
  @IsNotEmpty()
  status: string;
}
