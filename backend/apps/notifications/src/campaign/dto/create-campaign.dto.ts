import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCampaignDto {
  @IsString({ message: 'Title must be a string'})
  @IsNotEmpty({ message: 'Title is required'})
  title: string;

  @IsString({ message: 'Description must be a string'})
  @IsOptional()
  description: string;

  // @IsDate({message: 'SendTime must be a date'})
  @IsOptional()
  sendTime: Date;

  @IsBoolean({message: 'isDraft must be a boolean'})
  @IsOptional()
  isDraft?: boolean;  

  @IsString({ message: 'SegmentName must be a string'})
  @IsOptional()
  segmentName: string; // Change type to number

  @IsNumber({}, { each: true, message: 'SegmentId must be an array of numbers'})
  @IsOptional()
  segmentId: number;

  @IsNumber({}, { message: 'NotificationId must be a number'})
  @IsOptional()
  notificationId: number;
}