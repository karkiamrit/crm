import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTimeline } from './timelines.entity';
import { TransactionDocumentTimelineRepository } from './document.timelines.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentTimeline])],
  providers: [TransactionDocumentTimelineRepository],
  exports: [TransactionDocumentTimelineRepository],
})
export class DocumentTimelineRepositoryModule {}