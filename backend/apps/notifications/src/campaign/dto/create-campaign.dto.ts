import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  segmentId: number;

  @IsNumber()
  notificationId: number;
}