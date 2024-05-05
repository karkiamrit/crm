// mailchimp.module.ts
import { Module } from '@nestjs/common';
import { MailchimpController } from './mailchimp.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/notifications/.env',}),

    ClientsModule.registerAsync([
    {
      name: AUTH_SERVICE,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: configService.get('AUTH_HOST'),
          port: configService.get('AUTH_PORT'),
        },
      }),
      inject: [ConfigService],
    },
  ]),],
  controllers: [MailchimpController],
})
export class MailchimpModule {}
