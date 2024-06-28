import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO for creating a Transaction
 */
export class CreateTransactionsDto {
  @IsNumber({}, { message: 'Lead Id must be number' })
  @IsNotEmpty({ message: 'Lead Id is required' })
  leadId: number;

  @IsString({ message: 'Purpose should be string' })
  @IsNotEmpty({ message: 'Purpose should not be empty' })
  purpose: string;

  // @IsEnum(transactionStatus, {message: "Invalid status"})
  // @IsOptional()
  // status?: transactionStatus;

  // @IsEnum(listingStatus, {message: "Invalid listing status"})
  // @IsOptional()
  // listingStatus: listingStatus;

  // @IsFloat({ message: 'Listing Price must be number' })
  // @IsOptional({ message: 'Listing Price must not be empty' })
  // listingPrice: number;

  // @IsEnum(TransactionType, { message: 'Invalid type' })
  // @IsOptional()
  // type?: TransactionType;

  // @IsNotEmpty({ message: 'To Buyer must not be empty' })
  // toBuyer: boolean;

  // @IsOptional({ message: 'Closing Date must be date' })
  // @IsNotEmpty()
  // closingDate: Date;

  // @IsString({ message: 'Property Type must be string' })
  // @IsOptional()
  // propertyType: string;

  // @IsString({ message: 'Property Status must be string' })
  // @IsOptional()
  // propertyStatus: string;

  // @IsOptional()
  // @IsString({ message: 'Logo must be string' })
  // logo?: string;
}
