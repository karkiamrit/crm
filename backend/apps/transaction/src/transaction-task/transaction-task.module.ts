import { Module } from '@nestjs/common';
import { TransactionTaskService } from './transaction-task.service';
import { TransactionTaskController } from './transaction-task.controller';
import { TransactionTasksRepository } from './transaction-task.repository';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@app/common';
import { TransactionTask } from './entities/transaction-task.entity';


@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([TransactionTask]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/transaction-task/.env',
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
  controllers: [TransactionTaskController],
  providers: [TransactionTaskService, TransactionTasksRepository],
})
export class TransactionTaskModule {}
