import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ description: 'The title of the notification.', example: 'Notification Title' })
  title: string;

  @ApiProperty({ description: 'The message of the notification.', example: 'Notification Message' })
  message: string;

  @ApiProperty({ description: 'The subject of the notification.', example: 'Notification Subject' })
  subject: string;
}