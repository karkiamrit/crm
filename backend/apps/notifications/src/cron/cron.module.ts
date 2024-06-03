import { CronService } from './cron.service';
import { CronController } from './cron.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}
