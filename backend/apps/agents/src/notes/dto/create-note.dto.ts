import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
  
    @IsOptional()
    @IsNumber()
    leadId?: number;

    @IsOptional()
    @IsNumber()
    customerId?: number;

    @IsNotEmpty()
    @IsString({message: 'Content must be a string'})
    content: string;
}
