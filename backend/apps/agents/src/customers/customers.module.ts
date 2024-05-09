import { forwardRef, Module } from '@nestjs/common';

import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AgentsModule } from '../agents.module';
import { CustomerTimeline } from '../shared/objects/timelines/timelines.entity';
import { Product } from '../shared/objects/products/products.entity';
import { Service } from '../shared/objects/services/services.entity';
import { Customers } from './entities/customer.entity';
import { CustomerTimelineRepository } from '../shared/objects/timelines/customers.timelines.repository';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersRepository } from './customers.repository';
import { SegmentsRepository } from '../segments/segments.repository';
import { SegmentsModule } from '../segments/segments.module';

@Module({
  imports: [
    forwardRef(() => AgentsModule), 
    forwardRef(() => SegmentsModule),

    DatabaseModule,
    DatabaseModule.forFeature([Customers, CustomerTimeline, Product, Service, CustomerTimelineRepository]),
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
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRepository, CustomerTimelineRepository],
  exports: [CustomersService]
})
export class CustomersModule {}