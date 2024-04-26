import { IsOptional, IsEnum } from 'class-validator';
import { Priority } from "../../shared/data";

export class UpdateTaskDto {
  @IsOptional()
  name: string;

  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  taskDesc?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsOptional()
  customerId?: number;

  @IsOptional()
  leadId?: number;
}