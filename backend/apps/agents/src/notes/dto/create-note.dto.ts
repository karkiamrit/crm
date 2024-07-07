import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsOptional()
  @IsNumber({}, { message: 'Task Id must be a number' })
  taskId?: number;

  // @IsOptional()
  // @IsNumber({}, { message: 'Customer Id must be a number' })
  // customerId?: number;

  @IsNotEmpty()
  @IsString({ message: 'Content must be a string' })
  content: string;
}
