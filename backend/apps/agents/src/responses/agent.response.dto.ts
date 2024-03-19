import { ApiProperty } from '@nestjs/swagger';

export class AgentResponseDto {
  @ApiProperty({ description: 'The id of the agent.' })
  id: number;

  @ApiProperty({ description: 'The name of the agent.' })
  name: string;

  @ApiProperty({ description: 'The email of the agent.' })
  email: string;

  @ApiProperty({ description: 'The address of the agent.' })
  address: string;

  @ApiProperty({ description: 'The phone number of the agent.' })
  phone: string;

  @ApiProperty({ description: 'The reference id number of the agent.' })
  reference_no: string;

  @ApiProperty({ description: 'The documents of the agent.' })
  documents: string[];
}