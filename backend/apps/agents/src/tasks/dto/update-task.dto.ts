import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, IsArray } from 'class-validator';
import { Priority } from '../../shared/data';
import { TaskStatus } from './enums/task-status.enum';
import { ToDoType } from './enums/todo-type.enum';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'The name of the task' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiPropertyOptional({ description: 'The due date of the task' })
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'The description of the task' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  taskDesc?: string;

  @ApiPropertyOptional({ description: 'The priority of the task', enum: Priority })
  @IsEnum(Priority, { message: 'Priority must be a valid priority' })
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ description: 'The start date of the task' })
  @IsOptional({ message: 'Start date is optional' })
  startDate?: Date;

  @ApiPropertyOptional({ description: 'The status of the task', enum: TaskStatus })
  @IsEnum(TaskStatus, {
    message: 'Task Status must be one of the following: pending, completed',
  })
  @IsOptional({ message: 'Priority is optional' })
  status?: TaskStatus;

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

  @ApiPropertyOptional({ description: 'The reminder date of the task' })
  @IsOptional()
  reminderDate?: Date;
}