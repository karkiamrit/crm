import { IsJSON, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationsDto {
  @ApiProperty({
    description: 'The title of the notification.',
    example: 'Notification Title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The HTML content of the notification.',
    example: '<p>Notification HTML Content</p>',
  })
  @IsString()
  html_content: string;

  @ApiProperty({
    description: 'The text content of the notification.',
    example: 'Notification Text Content',
  })
  @IsString()
  text_content: string;

  @ApiProperty({
    description: 'The subject of the notification.',
    example: 'Notification Subject',
  })
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  json_content?: string;
}
