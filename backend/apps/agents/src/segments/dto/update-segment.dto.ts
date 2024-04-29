import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateSegmentDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
  }

  export class AddLeadsToSegmentDto {
    @IsArray()
    @IsNumber({}, { each: true })
    leadIds: number[];
  }