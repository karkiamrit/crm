import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RoleDto } from './role.dto';
import { IsStatus, Status } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'The email of the user.', required: false, example: 'johndoe@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateUserDtoAdmin extends UpdateUserDto {
  @ApiProperty({ description: 'The roles of the user.', required: false, type: [RoleDto], example: [{ name: 'Admin' }] })
  @IsOptional()
  @IsArray()
  roles?: RoleDto[];

  @ApiProperty({ description: 'The status of the user.', required: false, enum: Status, example: Status.Live })
  @IsOptional()
  @IsStatus()
  status?: Status;

  @ApiProperty({example: '1', description: 'The id of organization'})
  @IsOptional()
  @IsNumber()
  organizationId: number;
}