import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @IsOptional()
  @IsNumber({},{message: 'Number must be string'})
  id?: number;

  @ApiProperty({ description: 'The name of the role.', required: false , example: 'Admin'})
  @IsOptional()
  @IsString({message: 'Name must be string'})
  name?: string;
} 