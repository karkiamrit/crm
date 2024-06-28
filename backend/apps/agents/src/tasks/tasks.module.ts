import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { Tasks } from './entities/task.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LeadsModule } from '../leads/leads.module';
import { AgentsModule } from '../agents.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Tasks]),
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
    forwardRef(() => LeadsModule),
    forwardRef(() => AgentsModule),
    forwardRef(() => CustomersModule),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}
