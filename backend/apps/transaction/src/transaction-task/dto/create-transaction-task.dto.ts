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

  @IsEnum(transactionTaskType, { message: 'Invalid type' })
  @IsOptional()
  type?: transactionTaskType;



  @IsDateString()
  @IsNotEmpty({ message: 'Due Date must be date' })
  dueDate: Date;

  // @IsNumber({},{ message: 'Transaction Id must be number' })
  @IsNotEmpty({ message: 'Transaction Id must be number' })
  transactionId: number;

  @IsOptional()
  @IsString({ message: 'Template Document must be string'})
  templateDocument?: string;
}
