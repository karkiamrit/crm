import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCampaignDto {
    @IsString({ message: 'Title must be a string'})
    @IsOptional()
    title?: string;
  
    @IsString({ message: 'Description must be a string'})
    @IsOptional()
    description?: string;
  
    @IsOptional()
    @IsNumber({}, {message: 'SegmentId must be an array of numbers'})
    segmentId?: number;

    @IsString({ message: 'SegmentName must be a string'})
    @IsOptional ({ message: 'SegmentName is required'})
    segmentName: string; // Change type to number

    @IsOptional()
    sendTime: Date;

    @IsBoolean({message: 'isDraft must be a boolean'})
    @IsOptional()
    isDraft?: boolean;

    @IsNumber({}, { message: 'NotificationId must be a number'})
    @IsOptional()
    notificationId?: number;
}   