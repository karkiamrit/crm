import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
    @IsOptional()
    @IsNumber()
    leadId: number;

    @IsOptional()
    @IsString()
    content: string;
}
