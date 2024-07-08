import { IsOptional, IsEnum, IsString, IsNumber, IsArray } from 'class-validator';
import { Priority } from '../../shared/data';
import { TaskStatus } from './enums/task-status.enum';
import { ToDoType } from './enums/todo-type.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  taskDesc?: string;

  @IsEnum(Priority, { message: 'Priority must be a valid priority' })
  @IsOptional()
  priority?: Priority;

  @IsOptional({ message: 'Start date is optional' })
  startDate?: Date;

  @IsEnum(TaskStatus, {
    message: 'Task Status must be one of the following: pending, completed',
  })
  @IsOptional({ message: 'Priority is optional' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(ToDoType, {
    message: 'Task Type not matched',
  })
  todoType?: ToDoType;

  @IsOptional()
  @IsArray()
  comment: string[];

  @IsOptional()
  reminderDate?: Date;

  // @IsOptional()
  // @IsNumber({},{message: 'Status must be a number'})
  // customerId?: number;

  // @IsOptional()
  // @IsNumber({},{message: 'LeadId must be a number'})
  // leadId?: number;
  
}
