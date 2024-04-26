import { forwardRef, Module } from '@nestjs/common';
import { SegmentsController } from './segments.controller';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { Segment } from './entities/segment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LeadsModule } from '../leads/leads.module';
import { SegmentsRepository } from './segments.repository';
import { SegmentsService } from './segments.service';


@Module({
  imports:[
    DatabaseModule,
    forwardRef(()=>LeadsModule), 
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