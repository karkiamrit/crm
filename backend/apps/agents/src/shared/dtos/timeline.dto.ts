import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTimelineInputDTO {
    @IsNotEmpty()
    @IsString({ message: 'The attribute must be a string'})
    attribute: string;

    @IsNotEmpty()
    @IsString({ message: 'The value must be a string'})
    value: string;
}

export class UpdateTimelineInputDTO {
    @IsOptional()
    @IsString({ message: 'The attribute must be a string'})
    attribute?: string;

    @IsOptional()
    @IsString({ message: 'The value must be a string'})
    value?: string;
}