import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { transactionTaskType } from '../dto/enum';
import { IsDateString } from '@app/common/validators/date.validator';

/**
 * DTO for creating a Transaction
 */
export class CreateTransactionTaskDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Note must be string' })
  @IsOptional()
  note: string;

  @IsString({ message: 'AssignedTo must be string' })
  @IsOptional()
  assignedTo: string;

  @IsEnum(transactionTaskType, { message: 'Invalid type' })
  @IsOptional()
  type?: transactionTaskType;

  @IsNumber({},{ message: 'Customer Id must be number' })
  @IsNotEmpty({ message: 'Customer Id is required'})
  customerId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Due Date must be date' })
  dueDate: Date;

  @IsNumber()
  @IsNotEmpty({ message: 'Due Date must be date' })
  transactionId: number;
}
