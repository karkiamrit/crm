import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrganizationsDto } from './create-organization.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationsDto extends PartialType(CreateOrganizationsDto) {
    @ApiProperty({ description: 'The name of the organization.', example: 'Organization Name' })
    @IsOptional()
    @IsString()
    name: string;
  
    @ApiProperty({ description: 'The email of the organization.', example: 'organization@gmail.com' })
    @IsOptional()
    @IsString()
    email: string;
  
    @ApiProperty({ description: 'The address of the organization.', example: 'Toronto, Canada' })
    @IsOptional()
    @IsString()
    address: string;
  
    @ApiProperty({ description: 'The phone number of the organization.', example: '+1141121212' })
    @IsOptional()
    @IsString()
    phone: string;
}
