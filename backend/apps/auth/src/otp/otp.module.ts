import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Otp])],
  providers: [OtpService, OtpRepository],
  exports: [OtpService],
})
export class OtpModule {}
