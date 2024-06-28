import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioOauthStrategy extends PassportStrategy(Strategy, 'twilio') {
  constructor(private configService: ConfigService) {
    super({
      authorizationURL: 'https://www.twilio.com/authorize',
      tokenURL: 'https://api.twilio.com/oauth2/token',
      clientID: configService.get<string>('TWILIO_ACCOUNT_SID'),
      clientSecret: configService.get<string>('TWILIO_AUTH_TOKEN'),
      callbackURL: configService.get<string>('CALLBACK_URL'),
      scope: 'scope', // Replace with your desired scope
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    // Handle user validation here
    done(null, profile);
  }
}
