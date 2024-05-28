import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DocumentTimeline } from './timelines.entity';

@Injectable()
export class TransactionDocumentTimelineRepository extends AbstractRepository<DocumentTimeline> {
  protected readonly logger = new Logger(TransactionDocumentTimelineRepository.name);
  constructor(
    @InjectRepository(DocumentTimeline)
    transactionDocumentTimelineRepository: Repository<DocumentTimeline>,
    entityManager: EntityManager,
  ) {
    super(transactionDocumentTimelineRepository, entityManager);
  }
}
