import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationsDto {
  @ApiProperty({ description: 'The updated title of the notification.', example: 'Updated Notification Title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The updated message of the notification.', example: 'Updated Notification Message', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'The updated subject of the notification.', example: 'Updated Notification Subject', required: false })
  @IsOptional()
  @IsString()
  subject?: string;
}