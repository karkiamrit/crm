import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentsDto {
  @ApiProperty({ description: 'The name of the agent.', example: 'Agent Name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The email of the agent.', example: 'Agent Email' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'The address of the agent.', example: 'Agent Address' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'The phone number of the agent.', example: 'Agent Phone' })
  @IsString()
  phone: string;

}

export class CreateAgentsDtoWithDocuments extends CreateAgentsDto {
  documents: string[];
}
