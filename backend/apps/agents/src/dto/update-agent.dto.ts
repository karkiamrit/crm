import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAgentsDto {
  @ApiProperty({ description: 'The name of the agent.', example: 'Agent Name' })
  @IsString({ message: 'Name must be a string.' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The email of the agent.',
    example: 'Agent Email',
  })
  @IsString({ message: 'Email must be a string.' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The address of the agent.',
    example: 'Agent Address',
  })
  @IsString({ message: 'Address must be a string.' })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'The phone number of the agent.',
    example: 'Agent Phone',
  })
  @IsString({ message: 'Phone number must be a string.' })
  @IsOptional()
  phone?: string;
}

export class UpdateAgentDtoAdmin extends UpdateAgentsDto {
  @ApiProperty({
    description: 'The reference id number of the agent.',
    example: 'jasdj6j393',
  })
  @IsString({ message: 'Reference number must be a string.' })
  @IsOptional()
  reference_no?: string;
}
