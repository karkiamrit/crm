import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrganizationsDto } from './create-organization.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationsDto extends PartialType(
  CreateOrganizationsDto,
) {
  @ApiProperty({
    description: 'The name of the organization.',
    example: 'Organization Name',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name: string;

  @ApiProperty({
    description: 'The desc of the organization.',
    example: 'Organization Desc',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  description: string;

  @ApiProperty({
    description: 'The email of the organization.',
    example: 'organization@gmail.com',
  })
  @IsOptional()
  @IsString({ message: 'Email must be a string.' })
  email: string;

  @ApiProperty({
    description: 'The address of the organization.',
    example: 'Toronto, Canada',
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string.' })
  address: string;

  @ApiProperty({
    description: 'The phone number of the organization.',
    example: '+1141121212',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string.' })
  phone: string;
}
