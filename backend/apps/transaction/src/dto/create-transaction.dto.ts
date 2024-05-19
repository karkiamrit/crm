import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { transactionStatus, transactionType } from '../dto/enums';

/**
 * DTO for creating a Transaction
 */
export class CreateTransactionsDto {

    @IsEnum(transactionStatus, {message: "Invalid status"})
    @IsOptional()
    status?: transactionStatus;

    @IsString({message: "Listing Price must be string"})
    @IsNotEmpty()
    listingPrice: string;

    @IsEnum(transactionType,{message: "Invalid type"})
    @IsOptional()
    type?: transactionType;

    @IsBoolean({message: "Invalid toBuyer"})
    @IsNotEmpty()
    toBuyer: boolean;

    @IsString({message: "Customer Name must be string"})
    @IsOptional()
    customerName: string;

    @IsString({message: "Customer Phone must be string"})
    @IsOptional()
    customerPhone: string;

    @IsEmail({}, {message: "Invalid email"})
    @IsOptional()
    customerEmail: string;

    @IsOptional({message: "Closing Date must be date"})
    @IsNotEmpty()
    closingDate: Date;

}