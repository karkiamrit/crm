import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTimelineInputDTO {
    @IsNotEmpty()
    @IsString()
    attribute: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}

export class UpdateTimelineInputDTO {
    @IsOptional()
    @IsString()
    attribute?: string;

    @IsOptional()
    @IsString()
    value?: string;
}