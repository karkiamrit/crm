import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { AgentsRepository } from './agent.repository';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@app/common';
import { Agent } from './entities/agent.entity';
import { LeadsModule } from './leads/leads.module';
import { NotesModule } from './notes/notes.module';
import { CustomersModule } from './customers/customers.module';
import { SegmentsModule } from './segments/segments.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Agent]),
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
    LoggerModule,
    LeadsModule,
    NotesModule,
    CustomersModule,
    SegmentsModule
  ],
  controllers: [AgentsController],
  providers: [AgentsService, AgentsRepository],
  exports:[AgentsService, AgentsRepository]
})
export class AgentsModule {}
