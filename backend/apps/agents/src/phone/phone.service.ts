// phone.service.ts

import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class PhoneService {
  private readonly twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async makeCall(from: string, to: string, url: string): Promise<any> {
    try {
      const call = await this.twilioClient.calls.create({
        url,
        to,
        from,
      });
      return call;
    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  }
}
