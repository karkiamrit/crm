import { forwardRef, Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { Invoice } from './entities/invoice.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoicesRepository } from './invoices.repository';
import { AgentsModule } from '../agents.module';
import { CustomersModule } from '../customers/customers.module';
import { Product } from '../shared/objects/products/products.entity';
import { ProductRepository } from '../shared/objects/products/product.repository';

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
    ]),
    CustomersModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesRepository, ProductRepository],
  exports: [InvoicesService],
})
export class InvoicesModule {}
