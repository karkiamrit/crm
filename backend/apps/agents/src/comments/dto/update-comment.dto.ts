import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsOptional()
  @IsNumber()
  taskId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Task Id must be a number' })
  subTaskId?: number;
  // @IsOptional()
  // @IsNumber()
  // customerId: number;

  @IsOptional()
  @IsString({ message: 'Content must be string' })
  content: string;
}
