import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { RoleDto } from './role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@app/common';


export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user.' })
  @IsNotEmpty({ message: 'Email is required'})
  @IsEmail({},{ message: 'Email is invalid'})
  email: string;

  @ApiProperty({ example: '123456789wwE#', description: 'The password of the user.' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({},{ message: 'Password is too weak'})
  password: string;

  @ApiProperty({example: '1', description: 'The id of organization'})
  @IsNotEmpty({ message: 'Organization id is required'})
  @IsNumber({},{ message: 'Organization id must be a number'})
  organizationId: number;

  // @ApiProperty({ 
  //   type: RoleDto, 
  //   isArray: true, 
  //   example: [{ name: 'Admin' }, { name: 'User' }], 
  //   description: 'The roles of the user.' 
  // })
  // @IsOptional()
  // @IsArray()
  // roles?: RoleDto[];
}

export class CreateUserAdminDto extends CreateUserDto {
  @ApiProperty({ 
    type: RoleDto, 
    isArray: true, 
    example: [{ name: 'Admin' }, { name: 'User' }], 
    description: 'The roles of the user.' 
  })
  @IsOptional()
  @IsArray({message: 'Roles must be an array'})
  roles?: RoleDto[];

  @ApiProperty({ description: 'The status of the user.', enum: ['Live', 'Inactive'], example: 'Live' })
  @IsOptional()
  status?: Status;

}

