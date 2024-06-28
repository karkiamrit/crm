// phone.controller.ts

import { Controller, Get, Req, Res } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { twiml } from 'twilio';
import { Response, Request } from 'express'; // Add Request import

@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Get('voice')
  voice(@Res() res: Response) {
    const voiceResponse = new twiml.VoiceResponse();
    voiceResponse.say('Hello, World!');
    res.set('Content-Type', 'text/xml');
    res.send(voiceResponse.toString());
  }
  
  @Get('call')
  async makeCall(@Req() req: Request) {
    const { to, url } = req.query;
    const from = process.env.TWILIO_PHONE_NUMBER; // or use a dynamic from number

    if (!to || !url) {
      throw new Error('Required parameters "to" and "url" are missing.');
    }

    return this.phoneService.makeCall(from, to.toString(), url.toString());
  }
}
  