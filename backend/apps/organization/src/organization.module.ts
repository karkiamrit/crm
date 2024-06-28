import { Module } from '@nestjs/common';
import { OrganizationsService } from './organization.service';
import { OrganizationsController } from './organization.controller';
import { OrganizationsRepository } from './organization.repository';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@app/common';
import { Organization } from './entities/organization.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Organization]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/organization/.env',
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
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository],
})
export class OrganizationModule {}
