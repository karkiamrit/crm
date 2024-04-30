import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationsDto {
  @ApiProperty({ description: 'The name of the organization.', example: 'Organization Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The email of the organization.', example: 'Organization Email' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'The address of the organization.', example: 'Organization Address' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'The phone number of the organization.', example: 'Organization Phone' })
  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  logo?: string;
}