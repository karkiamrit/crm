import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { AUTH_SERVICE, DatabaseModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { Email } from './entities/email.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LeadsModule } from '../leads/leads.module';
import { EmailsRepository } from './emails.repository';

@Module({
  imports:[DatabaseModule,
    DatabaseModule.forFeature([Email]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/agent/.env',
    }),
    LeadsModule,
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
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST'),
            port: configService.get('NOTIFICATIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),],
  controllers: [EmailsController],
  providers: [EmailsService, EmailsRepository],
})
export class EmailsModule {}
