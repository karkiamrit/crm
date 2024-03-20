import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { LeadsRepository } from './leads.repository';
import { Leads } from './entities/lead.entity';
import { LeadTimeline } from './timelines/timelines.entity';
import { Product } from './products/products.entity';
import { Service } from './services/services.entity';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Leads, LeadTimeline, Product, Service, LeadsRepository]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/agent/.env',
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
  ],
  controllers: [LeadsController],
  providers: [LeadsService, LeadsRepository],
  exports: [LeadsService]
})
export class LeadsModule {}