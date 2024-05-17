import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { transactionTaskType } from '../dto/enum';

/**
 * DTO for updating a Transaction
 */
export class UpdateTransactionTaskDto {
    @IsString({message: "Name must be string"})
    @IsOptional()
    name?: string;

    @IsEnum(transactionTaskType, {message: "Invalid type"})
    @IsOptional()
    type?: transactionTaskType;

    @IsNumber({},{ message: 'Customer Id must be number' })
    @IsOptional()
    customerId?: number;
  
    @IsOptional({message: "Due Date must be date"})
    dueDate: Date;
}