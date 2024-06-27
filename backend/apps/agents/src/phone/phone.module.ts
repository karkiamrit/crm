import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';
import { TwilioOauthStrategy } from './strategy/twilio.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'twilio' })],
  controllers: [PhoneController],
  providers: [PhoneService, TwilioOauthStrategy],
})
export class PhoneModule {}
