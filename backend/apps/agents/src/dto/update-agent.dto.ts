import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAgentsDto {
  @ApiProperty({ description: 'The name of the agent.', example: 'Agent Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The email of the agent.', example: 'Agent Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'The address of the agent.', example: 'Agent Address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'The phone number of the agent.', example: 'Agent Phone' })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateAgentDtoAdmin extends UpdateAgentsDto{
  @ApiProperty({ description: 'The reference id number of the agent.', example: 'jasdj6j393' })
  @IsString()
  @IsOptional()
  reference_no?: string;
}