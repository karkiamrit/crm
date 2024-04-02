import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateNoteDto {
  
    @IsNotEmpty()
    @IsNumber()
    leadId: number;

    @IsNotEmpty()
    @IsString()
    content: string;
}
