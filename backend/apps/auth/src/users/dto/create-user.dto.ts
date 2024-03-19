import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { RoleDto } from './role.dto';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456789wwE#', description: 'The password of the user.' })
  @IsStrongPassword()
  password: string;

  @ApiProperty({example: '1', description: 'The id of organization'})
  @IsNumber()
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
  @IsArray()
  roles?: RoleDto[];
}

