// phone.controller.ts

import { Controller, Get, Req } from '@nestjs/common';
import { PhoneService } from './phone.service';

@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Get('call')
  async makeCall(@Req() req) {
    const { to, url } = req.query;
    const from = process.env.TWILIO_PHONE_NUMBER; // or use a dynamic from number

    if (!to || !url) {
      throw new Error('Required parameters "to" and "url" are missing.');
    }

    return this.phoneService.makeCall(from, to, url.toString());
  }
}
  