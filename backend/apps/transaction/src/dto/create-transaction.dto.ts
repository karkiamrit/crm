import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO for creating a Transaction
 */
export class CreateTransactionsDto {
  @ApiProperty({ description: 'The ID of the lead' })
  @IsNumber({}, { message: 'Lead Id must be number' })
  @IsNotEmpty({ message: 'Lead Id is required' })
  leadId: number;

  @ApiProperty({ description: 'The purpose of the transaction' })
  @IsString({ message: 'Purpose should be string' })
  @IsNotEmpty({ message: 'Purpose should not be empty' })
  purpose: string;

  // Other properties are commented out, uncomment and add @ApiProperty decorators as needed
}