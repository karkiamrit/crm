import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  DatabaseModule,
  NOTIFICATIONS_SERVICE,
  ORGANIZATION_SERVICE,
  Role,
  User,
} from '@app/common';
import { UsersRepository } from './users.repository';
import { RolesRepository } from './roles.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([User, Role]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/agent/.env',
    }),
    ClientsModule.registerAsync([
      {
        name: ORGANIZATION_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('ORGANIZATIONS_HOST'),
            port: configService.get('ORGANIZATIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, RolesRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
