import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
import { Priority } from "../../shared/data";

export class UpdateTaskDto {
  @IsOptional()
  @IsString({message: 'Name must be a string'})
  name: string;

  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  @IsString({message: 'Description must be a string'})
  taskDesc?: string;

  @IsEnum(Priority, {message: 'Priority must be a valid priority'})
  @IsOptional()
  priority?: Priority;

  @IsOptional()
  @IsNumber({},{message: 'Status must be a number'})
  customerId?: number;

  @IsOptional()
  @IsNumber({},{message: 'LeadId must be a number'})
  leadId?: number;
}