import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateSegmentDto {
    @IsString()
    @IsOptional()
    name: string;
  }