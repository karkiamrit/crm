import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { transactionTaskType } from '../dto/enum';

/**
 * DTO for updating a Transaction
 */
export class UpdateTransactionTaskDto {
  @ApiPropertyOptional({ description: 'The name of the task' })
  @IsString({ message: 'Name must be string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'The note for the task' })
  @IsString({ message: 'Note must be string' })
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ description: 'The type of the task', enum: transactionTaskType })
  @IsEnum(transactionTaskType, { message: 'Invalid type' })
  @IsOptional()
  type?: transactionTaskType;

  @ApiPropertyOptional({ description: 'The ID of the lead' })
  @IsNumber({}, { message: 'Customer Id must be number' })
  @IsOptional()
  leadId?: number;

  @ApiPropertyOptional({ description: 'The due date of the task' })
  @IsOptional({ message: 'Due Date must be date' })
  dueDate: Date;

  @ApiPropertyOptional({ description: 'The template document for the task' })
  @IsOptional()
  @IsString({ message: 'Template Document must be string' })
  templateDocument?: string;
}