import { forwardRef, Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { AUTH_SERVICE, DatabaseModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { Invoice } from './entities/invoice.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoicesRepository } from './invoices.repository';
import { AgentsModule } from '../agents.module';
import { Product } from '../shared/objects/products/products.entity';
import { ProductRepository } from '../shared/objects/products/product.repository';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [
    forwardRef(() => AgentsModule),
    DatabaseModule,
    DatabaseModule.forFeature([Invoice, Product, ProductRepository]),
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
    ]),
    LeadsModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesRepository, ProductRepository],
  exports: [InvoicesService],
})
export class InvoicesModule {}
