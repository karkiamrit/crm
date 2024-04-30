import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDto {
  @ApiProperty({ description: 'The id of the user.', example: 1})
  @IsString({ message: 'Id must be a string.'})
  @IsNotEmpty({ message: 'Id is required.'})
  id: number;
}
