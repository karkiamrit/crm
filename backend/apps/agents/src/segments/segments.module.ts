import { forwardRef, Module } from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { SegmentsController } from './segments.controller';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { Segment } from './entities/segment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LeadsModule } from '../leads/leads.module';
import { SegmentsRepository } from './segments.repository';
import { LeadsRepository } from '../leads/leads.repository';
import { LeadsService } from '../leads/leads.service';
import { AgentsModule } from '../agents.module';

@Module({
  imports:[
    DatabaseModule,
    LeadsModule, 
    DatabaseModule.forFeature([Segment]),
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
  controllers: [SegmentsController],
  providers: [SegmentsService, SegmentsRepository],
  exports: [SegmentsService, SegmentsRepository]
})
export class SegmentsModule {}
