import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { listingStatus, transactionStatus, transactionType } from '../dto/enums';
/**
 * DTO for updating a Transaction
 */
export class UpdateTransactionsDto {
    
    @IsEnum(transactionStatus, {message: "Invalid status"})
    @IsOptional()
    status?: transactionStatus;

    @IsEnum(transactionType, {message: "Invalid type"})
    @IsOptional()
    type?: transactionType;

    @IsOptional()
    toBuyer?: boolean;

    @IsEnum(listingStatus, {message: "Invalid status"})
    @IsOptional()
    listingStatus: listingStatus;

    @IsOptional({message: "Closing Date must be date"})
    closingDate?: Date;

    @IsNumber({}, {message: "Price must be number"})
    @IsOptional()
    listingPrice?: number;
  
    @IsString({message: "Property Type must be string"})
    @IsOptional()
    propertyType?: string;
  
    @IsString({message: "Listing Address must be string"})
    @IsOptional()
    listingAddress?: string;

    @IsString({message: "Property Status must be string"})
    @IsOptional()
    propertyStatus?: string;

    @IsOptional()
    @IsString({message: "Logo must be string"})
    logo: string;

}