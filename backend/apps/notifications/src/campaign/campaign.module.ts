import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Campaign } from './entities/campaign.entity';
import { CampaignController } from './campaign.controller';
import { CampaignsService } from './campaign.service';
import { CampaignsRepository } from './campaign.repository';
import { NotificationsModule } from '../notifications.module';
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Campaign]),
    forwardRef(()=>NotificationsModule),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/notifications/.env',
    }),
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
    ]),
    LoggerModule,
  ],
  controllers: [CampaignController],
  providers: [CampaignsService, CampaignsRepository],
  exports: [CampaignsService],
})
export class CampaignsModule {}
