import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: 'The name of the role.', required: false , example: 'Admin'})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
} 