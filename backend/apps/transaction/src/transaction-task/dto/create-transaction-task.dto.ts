import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { transactionTaskType } from '../dto/enum';

/**
 * DTO for creating a Transaction
 */
export class CreateTransactionTaskDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEnum(transactionTaskType, { message: 'Invalid type' })
  @IsOptional()
  type?: transactionTaskType;

  @IsNumber({},{ message: 'Customer Id must be number' })
  @IsNotEmpty({ message: 'Customer Id is required'})
  customerId: number;

  @IsNotEmpty({ message: 'Due Date must be date' })
  dueDate: Date;
}
