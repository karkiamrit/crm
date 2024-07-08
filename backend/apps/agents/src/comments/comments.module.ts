import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { LeadsModule } from '../leads/leads.module';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { Comment } from './entities/comment.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from '../tasks/tasks.module';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Comment, CommentsRepository]),
    TasksModule,
    NotesModule,
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
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
