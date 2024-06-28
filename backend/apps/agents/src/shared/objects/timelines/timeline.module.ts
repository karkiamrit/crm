import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTimeline } from './timelines.entity';
import { LeadTimeline } from './timelines.entity';
import { CustomerTimelineRepository } from './customers.timelines.repository';
import { LeadTimelineRepository } from './leads.timelines.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTimeline, LeadTimeline])],
  providers: [CustomerTimelineRepository, LeadTimelineRepository],
  exports: [CustomerTimelineRepository, LeadTimelineRepository],
})
export class TimelineRepositoryModule {}
