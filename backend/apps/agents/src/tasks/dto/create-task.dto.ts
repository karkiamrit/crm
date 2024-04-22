import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Priority } from "../../shared/data";

export class CreateTaskDto {
  @IsNotEmpty()
  dueDate?: Date;

  @IsNotEmpty()
  taskDesc?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsOptional()
  customerId?: number;

  @IsOptional()
  leadId?: number;
}