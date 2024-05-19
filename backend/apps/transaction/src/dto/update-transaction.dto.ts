import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { transactionStatus, transactionType } from '../dto/enums';
/**
 * DTO for updating a Transaction
 */
export class UpdateTransactionsDto {
    
    @IsEnum(transactionStatus, {message: "Invalid status"})
    @IsOptional()
    status?: transactionStatus;

    @IsString({message: "Listing Price must be string"})
    @IsOptional()
    listingPrice?: string;

    @IsEnum(transactionType, {message: "Invalid type"})
    @IsOptional()
    type?: transactionType;

    @IsBoolean({message: "Invalid toBuyer"})
    @IsOptional()
    toBuyer?: boolean;

    @IsString({message: "Customer Name must be string"})
    @IsOptional()
    customerName?: string;

    @IsString({message: "Customer Phone must be string"})
    @IsOptional()
    customerPhone?: string;

    @IsEmail({}, {message: "Invalid email"})
    @IsOptional()
    customerEmail?: string;

    @IsOptional({message: "Closing Date must be date"})
    closingDate?: Date;

}