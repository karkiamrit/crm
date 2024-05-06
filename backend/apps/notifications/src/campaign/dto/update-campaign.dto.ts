import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCampaignDto {
    @IsString()
    @IsOptional()
    title?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsNumber()
    @IsOptional()
    segmentId?: number;
}