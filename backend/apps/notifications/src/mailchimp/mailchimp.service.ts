import { Injectable } from '@nestjs/common';
import { CreateMailchimpDto } from './dto/create-mailchimp.dto';
import { UpdateMailchimpDto } from './dto/update-mailchimp.dto';

@Injectable()
export class MailchimpService {
  create(createMailchimpDto: CreateMailchimpDto) {
    return 'This action adds a new mailchimp';
  }

  findAll() {
    return `This action returns all mailchimp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mailchimp`;
  }

  update(id: number, updateMailchimpDto: UpdateMailchimpDto) {
    return `This action updates a #${id} mailchimp`;
  }

  remove(id: number) {
    return `This action removes a #${id} mailchimp`;
  }
}
