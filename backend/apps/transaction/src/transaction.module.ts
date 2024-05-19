import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionsRepository } from './transaction.repository';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@app/common';
import { Transaction } from './entities/transaction.entity';
import { TransactionTaskModule } from './transaction-task/transaction-task.module';
import { ListingModule } from './listing/listing.module';
import { DocumentsModule } from 'apps/agents/src/documents/documents.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Transaction]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/transaction/.env',
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
    TransactionTaskModule,
    ListingModule,
    DocumentsModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionsRepository],
})
export class TransactionModule {}
