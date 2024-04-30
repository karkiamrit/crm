import { IsNotEmpty, IsOptional, IsEnum, IsString, IsDate, IsNumber } from 'class-validator';
import { Priority } from "../../shared/data";

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Name is required'})
  @IsString({ message: 'Name must be a string'})
  name: string;
  
  @IsNotEmpty({ message: 'Due date is required'})
  dueDate?: Date;

  @IsNotEmpty({ message: 'Description is required'})
  @IsString({ message: 'Description must be a string'})
  taskDesc?: string;

  @IsEnum(Priority, { message: 'Priority must be one of the following: low, medium, high'})
  @IsOptional({ message: 'Priority is optional'})
  priority?: Priority;

  @IsOptional({ message: 'Customer ID is optional'})
  @IsNumber({},{ message: 'Customer ID must be a number'})
  customerId?: number;

  @IsOptional()
  @IsNumber({},{ message: 'Lead ID must be a number'})
  leadId?: number;
}