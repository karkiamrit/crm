import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsDate,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Priority } from '../../shared/data';
import { TaskType } from '../../shared/data/enums/task-type.enum';
import { TaskStatus } from './enums/task-status.enum';
import { ToDoType } from './enums/todo-type.enum';

export class CreateTaskDto {
  @ApiProperty({ description: 'The name of the task' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ description: 'The due date of the task' })
  @IsNotEmpty({ message: 'Due date is required' })
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'The reminder date of the task' })
  @IsOptional()
  reminderDate?: Date;

  @ApiPropertyOptional({ description: 'The start date of the task' })
  @IsOptional({ message: 'Start date is required' })
  startDate?: Date;

  @ApiProperty({ description: 'The description of the task' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  taskDesc?: string;

  @ApiPropertyOptional({ description: 'The priority of the task', enum: Priority })
  @IsEnum(Priority, {
    message: 'Priority must be one of the following: low, medium, high',
  })
  @IsOptional({ message: 'Priority is optional' })
  priority?: Priority;

  @ApiPropertyOptional({ description: 'The status of the task', enum: TaskStatus })
  @IsEnum(TaskStatus, {
    message: 'Task Status must be one of the following: pending, completed',
  })
  @IsOptional({ message: 'Priority is optional' })
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'The customer ID associated with the task' })
  @IsOptional({ message: 'Customer ID is optional' })
  @IsNumber({}, { message: 'Customer ID must be a number' })
  customerId?: number;

  @ApiPropertyOptional({ description: 'The agent ID associated with the task' })
  @IsOptional({ message: 'Agent ID is optional' })
  @IsNumber({}, { message: 'Agent ID must be a number' })
  agentId?: number;

  @ApiPropertyOptional({ description: 'The lead ID associated with the task' })
  @IsOptional()
  @IsNumber({}, { message: 'Lead ID must be a number' })
  leadId?: number;

  @ApiPropertyOptional({ description: 'The type of the task', enum: TaskType })
  @IsOptional()
  @IsEnum(TaskType, {
    message: 'TaskType not Lead or Agent',
  })
  taskType?: TaskType;

  @ApiPropertyOptional({ description: 'The type of the to-do', enum: ToDoType })
  @IsOptional()
  @IsEnum(ToDoType, {
    message: 'Task Type not matched',
  })
  todoType?: ToDoType;

  @ApiPropertyOptional({ description: 'The comments associated with the task', type: [String] })
  @IsOptional()
  @IsArray()
  comment: string[];
}