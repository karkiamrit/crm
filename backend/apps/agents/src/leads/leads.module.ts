import { forwardRef, Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { LeadsRepository } from './leads.repository';
import { Leads } from './entities/lead.entity';

import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AgentsModule } from '../agents.module';
import { CustomerTimeline, LeadTimeline } from '../shared/objects/timelines/timelines.entity';
import { Product } from '../shared/objects/products/products.entity';
import { Service } from '../shared/objects/services/services.entity';
import { LeadTimelineRepository } from '../shared/objects/timelines/leads.timelines.repository';
import { CustomerTimelineRepository } from '../shared/objects/timelines/customers.timelines.repository';
import { CustomersService } from '../customers/customers.service';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    forwardRef(() => AgentsModule), 
    DatabaseModule,
    DatabaseModule.forFeature([Leads, LeadTimeline, Product, Service, LeadTimelineRepository, CustomerTimelineRepository, CustomerTimeline]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/agent/.env',
    }),
    CustomersModule,
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
  providers: [LeadsService, LeadsRepository, LeadTimelineRepository, CustomerTimelineRepository],
  exports: [LeadsService]
})
export class LeadsModule {}