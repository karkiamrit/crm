import { Module, forwardRef } from '@nestjs/common';
import { TransactionTaskService } from './transaction-task.service';
import { TransactionTaskController } from './transaction-task.controller';
import { TransactionTaskRepository } from './transaction-task.repository';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@app/common';
import { TransactionTask } from './entities/transaction-task.entity';
import { TransactionModule } from '../transaction.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([TransactionTask]),
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
    forwardRef(()=>TransactionModule),
  ],
  controllers: [TransactionTaskController],
  providers: [TransactionTaskService, TransactionTaskRepository],
  exports: [TransactionTaskService, TransactionTaskRepository]
})
export class TransactionTaskModule {}
