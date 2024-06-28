import { IsJSON, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationsDto {
  @ApiProperty({
    description: 'The updated title of the notification.',
    example: 'Updated Notification Title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The updated HTML content of the notification.',
    example: '<p>Updated Notification HTML Content</p>',
    required: false,
  })
  @IsOptional()
  @IsString()
  html_content?: string;

  @ApiProperty({
    description: 'The updated text content of the notification.',
    example: 'Updated Notification Text Content',
    required: false,
  })
  @IsOptional()
  @IsString()
  text_content?: string;

  @ApiProperty({
    description: 'The updated subject of the notification.',
    example: 'Updated Notification Subject',
    required: false,
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  json_content?: string;
}
