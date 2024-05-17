import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating a Listing
 */
export class UpdateListingsDto {
    @IsString({ message: 'Name must be string' })
    @IsOptional()
    name?: string;
  
    @IsString({ message: 'Price must be string' })
    @IsOptional()
    price?: string;
  
    @IsString({ message: 'Property Type must be string' })
    @IsOptional()
    propertyType?: string;
  
    @IsString({ message: 'Offer Type must be string' })
    @IsOptional()
    offerType?: string;
  
    @IsString({ message: 'Floor must be string' })
    @IsOptional()
    floor?: string;
  
    @IsString({ message: 'Building Area must be string' })
    @IsOptional()
    buildingArea?: string;
  
    @IsString({ message: 'Surface Area must be string' })
    @IsOptional()
    surfaceArea?: string;
  
    @IsString({ message: 'Status must be string' })
    @IsOptional()
    status?: string;
  }