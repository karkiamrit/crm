import { IsFloat } from '@app/common/validators/float.validator';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * DTO for creating a Listing
 */
export class CreateListingsDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name Must Not Be Empty' })
  name: string;

  @IsNumber({},{ message: 'Price must be number' })
  @IsNotEmpty({message: 'Price Must Not Be Empty'})
  price: number;

  @IsString({ message: 'Property Type must be string' })
  @IsNotEmpty({message: 'Property type Must Not Be Empty'})
  propertyType: string;

  @IsString({ message: 'Offer Type must be string' })
  @IsNotEmpty({message: 'Offer Type Must Not Be Empty'})
  offerType: string;

  @IsNumber({},{ message: 'Floor must be number' })
  @IsNotEmpty({message: 'floor must not be empty'})
  floor: number;

  @IsFloat({ message: 'Building Area must be float' })
  @IsNotEmpty({message: 'Building Area Must Not Be Empty'})
  buildingArea: number;

  @IsString({message: "Listing Address must be string"})
  @IsNotEmpty({message: 'Listing Address Must Not Be Empty'})
  listingAddress?: string;

  @IsString({message: "Listing City must be string"})
  @IsNotEmpty({message: 'listing city Must Not Be Empty'})
  listingCity?: string;

  @IsFloat({ message: 'Surface Area must be float' })
  @IsNotEmpty({message:'Surface Area cant be empty'})
  surfaceArea: number;

  @IsString({ message: 'Status must be string' })
  @IsNotEmpty({message: 'Status Must Be String'})
  status: string;


}
