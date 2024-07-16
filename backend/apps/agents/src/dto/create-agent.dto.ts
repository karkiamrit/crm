import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentsDto {
  @ApiProperty({ description: 'The name of the agent.', example: 'Agent Name' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string.' })
  name: string;

  @ApiProperty({
    description: 'The email of the agent.',
    example: 'Agent Email',
  })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsString({ message: 'Email must be a string.' })
  email: string;

  @ApiProperty({
    description: 'The address of the agent.',
    example: 'Agent Address',
  })
  @IsNotEmpty({ message: 'Address cannot be empty' })
  @IsString({ message: 'Address must be a string.' })
  address: string;

  @ApiProperty({
    description: 'The phone number of the agent.',
    example: 'Agent Phone',
  })
  @IsNotEmpty({ message: 'Phone cannot be empty' })
  @IsString({ message: 'Phone must be string' })
  phone: string;
}

export class CreateAgentsDtoWithDocuments extends CreateAgentsDto {
  @ApiProperty({ type: [String], description: 'The documents associated with the agent.', example: ['Document1', 'Document2'] })
  documents: string[];
}