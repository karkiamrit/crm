import { IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

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

    @IsDate({message: 'SendTime must be a date'})
    @IsOptional()
    sendTime: Date;
}