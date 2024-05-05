import { PartialType } from '@nestjs/swagger';
import { CreateMailchimpDto } from './create-mailchimp.dto';

export class UpdateMailchimpDto extends PartialType(CreateMailchimpDto) {}
