import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CampaignsModule } from '../campaign/campaign.module';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), CampaignsModule],

  providers: [CronService],
})
export class CronModule {}
