import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'The name of the task' })
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiPropertyOptional({ description: 'The note for the task' })
  @IsString({ message: 'Note must be string' })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ description: 'The type of the task', enum: transactionTaskType })
  @IsEnum(transactionTaskType, { message: 'Invalid type' })
  @IsOptional()
  type?: transactionTaskType;

  @ApiProperty({ description: 'The due date of the task' })
  @IsDateString()
  @IsNotEmpty({ message: 'Due Date must be date' })
  dueDate: Date;

  @ApiProperty({ description: 'The ID of the transaction' })
  @IsNotEmpty({ message: 'Transaction Id must be number' })
  transactionId: number;

  @ApiPropertyOptional({ description: 'The template document for the task' })
  @IsOptional()
  @IsString({ message: 'Template Document must be string' })
  templateDocument?: string;
}