import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationsDto {
  @ApiProperty({ description: 'The title of the notification.', example: 'Notification Title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The message of the notification.', example: 'Notification Message' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'The subject of the notification.', example: 'Notification Subject' })
  @IsString()
  subject: string;
}