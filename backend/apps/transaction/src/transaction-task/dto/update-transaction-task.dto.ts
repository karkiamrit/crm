import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { transactionTaskType } from '../dto/enum';

/**
 * DTO for updating a Transaction
 */
export class UpdateTransactionTaskDto {
    @IsString({message: "Name must be string"})
    @IsOptional()
    name?: string;

    @IsString({ message: 'Note must be string' })
    @IsOptional()
    note?: string;

    @IsEnum(transactionTaskType, {message: "Invalid type"})
    @IsOptional()
    type?: transactionTaskType;

    @IsNumber({},{ message: 'Customer Id must be number' })
    @IsOptional()
    leadId?: number;
  
    @IsOptional({message: "Due Date must be date"})
    dueDate: Date;

    @IsOptional()
    @IsString({ message: 'Template Document must be string'})
    templateDocument?: string;
}