import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({ example: 1, description: 'The id of the task' })
  @IsOptional()
  @IsNumber()
  taskId: number;

  @ApiProperty({ example: 1, description: 'The id of the subtask' })
  @IsOptional()
  @IsNumber({}, { message: 'Task Id must be a number' })
  subTaskId?: number;

  // @ApiProperty({ example: 1, description: 'The id of the customer' })
  // @IsOptional()
  // @IsNumber()
  // customerId: number;

  @ApiProperty({ example: 'Updated comment', description: 'The updated content of the comment' })
  @IsOptional()
  @IsString({ message: 'Content must be string' })
  content: string;
}