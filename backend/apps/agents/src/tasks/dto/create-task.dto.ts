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
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Due date is required' })
  dueDate?: Date;

  @IsOptional()
  reminderDate?: Date;

  @IsOptional({ message: 'Start date is required' })
  startDate?: Date;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  taskDesc?: string;

  @IsEnum(Priority, {
    message: 'Priority must be one of the following: low, medium, high',
  })
  @IsOptional({ message: 'Priority is optional' })
  priority?: Priority;

  @IsEnum(TaskStatus, {
    message: 'Task Status must be one of the following: pending, completed',
  })
  @IsOptional({ message: 'Priority is optional' })
  status?: TaskStatus;

  @IsOptional({ message: 'Customer ID is optional' })
  @IsNumber({}, { message: 'Customer ID must be a number' })
  customerId?: number;

  @IsOptional({ message: 'Agent ID is optional' })
  @IsNumber({}, { message: 'Agent ID must be a number' })
  agentId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Lead ID must be a number' })
  leadId?: number;

  @IsOptional()
  @IsEnum(TaskType, {
    message: 'TaskType not Lead or Agent',
  })
  taskType?: TaskType;

  @IsOptional()
  @IsEnum(ToDoType, {
    message: 'Task Type not matched',
  })
  todoType?: ToDoType;

  @IsOptional()
  @IsArray()
  comment: string[];
}
