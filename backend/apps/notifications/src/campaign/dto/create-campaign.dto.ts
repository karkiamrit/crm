import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsString({ message: 'Title must be a string'})
  title: string;

  @IsString({ message: 'Description must be a string'})
  description: string;

  @IsNumber({}, { each: true, message: 'SegmentId must be an array of numbers'})
  segmentId: number;

  @IsNumber({}, { message: 'NotificationId must be a number'})
  notificationId: number;
}