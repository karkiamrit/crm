import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { ListingsRepository } from './listing.repository';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@app/common';
import { Listing } from './entities/listing.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Listing]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/listing/.env',
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
  controllers: [ListingController],
  providers: [ListingService, ListingsRepository],
})
export class ListingModule {}
