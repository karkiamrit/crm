import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { listingStatus, transactionStatus, transactionType } from '../dto/enums';
import { IsFloat } from '@app/common/validators/float.validator';

/**
 * DTO for creating a Transaction
 */
export class CreateTransactionsDto {

    // @IsEnum(transactionStatus, {message: "Invalid status"})
    // @IsOptional()
    // status?: transactionStatus;

    // @IsEnum(listingStatus, {message: "Invalid listing status"})
    // @IsOptional()
    // listingStatus: listingStatus;

    @IsFloat({message: "Listing Price must be number"})
    @IsOptional({message: "Listing Price must not be empty"})
    listingPrice: number;

    @IsEnum(transactionType,{message: "Invalid type"})
    @IsOptional()
    type?: transactionType;

    @IsNotEmpty({message: "To Buyer must not be empty"})
    toBuyer: boolean;

    @IsOptional({message: "Closing Date must be date"})
    @IsNotEmpty()
    closingDate: Date;
  
    @IsString({message: "Property Type must be string"})
    @IsOptional()
    propertyType: string;
  
    @IsString({message: "Listing Address must be string"})
    @IsNotEmpty()
    listingAddress: string;

    @IsString({message: "Property Status must be string"})
    @IsOptional()
    propertyStatus: string;

    @IsOptional()
    @IsString({ message: 'Logo must be string'})
    logo?: string;

}