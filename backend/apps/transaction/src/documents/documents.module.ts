import { forwardRef, Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { AGENTS_SERVICE, AUTH_SERVICE, DatabaseModule } from '@app/common';
import { Document } from './entities/document.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DocumentsRepository } from './documents.repository';
import { TransactionTaskRepository } from '../transaction-task/transaction-task.repository';
import { TransactionTaskModule } from '../transaction-task/transaction-task.module';
import { DocumentTimelineRepositoryModule } from './timelines/timeline.module';




@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Document]),
    forwardRef(()=>TransactionTaskModule),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/transaction/.env',
    }),
    DocumentTimelineRepositoryModule,
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
      ,
      {
        name: AGENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AGENTS_HOST'),
            port: configService.get('AGENTS_PORT'),
          },
        }),
        inject: [ConfigService]
      }
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentsRepository],
  exports: [DocumentsService]
})
export class DocumentsModule {}
