import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
  
    @IsOptional()
    @IsNumber({},{message: 'Lead Id must be a number'})
    leadId?: number;

    @IsOptional()
    @IsNumber({},{message: 'Customer Id must be a number'})
    customerId?: number;

    @IsNotEmpty()
    @IsString({message: 'Content must be a string'})
    content: string;
}
