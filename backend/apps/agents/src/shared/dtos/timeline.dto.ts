import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTimelineInputDTO {
  @IsNotEmpty()
  @IsString({ message: 'The attribute must be a string' })
  attribute: string;

  @IsNotEmpty()
  @IsString({ message: 'The value must be a string' })
  value: string;

  @IsOptional()
  @IsString({ message: 'The previous value must be a string' })
  previousValue?: string;

  @IsOptional()
  @IsString({ message: 'The previous value must be a string' })
  createdBy?: string;
}

export class UpdateTimelineInputDTO {
  @IsOptional()
  @IsString({ message: 'The attribute must be a string' })
  attribute?: string;

  @IsOptional()
  @IsString({ message: 'The value must be a string' })
  value?: string;

  @IsOptional()
  @IsString({ message: 'The previous value must be a string' })
  previousValue?: string;

  @IsOptional()
  @IsString({ message: 'The previous value must be a string' })
  createdBy?: string;
}
