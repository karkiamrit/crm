import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'The id of the task' })
  @IsOptional()
  @IsNumber({}, { message: 'Task Id must be a number' })
  taskId?: number;

  @ApiProperty({ example: 1, description: 'The id of the subtask' })
  @IsOptional()
  @IsNumber({}, { message: 'Task Id must be a number' })
  subTaskId?: number;

  // @ApiProperty({ example: 1, description: 'The id of the customer' })
  // @IsOptional()
  // @IsNumber({}, { message: 'Customer Id must be a number' })
  // customerId?: number;

  @ApiProperty({ example: 'This is a comment', description: 'The content of the comment' })
  @IsNotEmpty()
  @IsString({ message: 'Content must be a string' })
  content: string;
}