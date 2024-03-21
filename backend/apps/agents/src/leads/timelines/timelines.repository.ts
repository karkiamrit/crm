import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { LeadTimeline } from './timelines.entity';

@Injectable()
export class LeadTimelineRepository extends AbstractRepository<LeadTimeline> {
  protected readonly logger = new Logger(LeadTimelineRepository.name);
  constructor(
    @InjectRepository(LeadTimeline)
    leadTimelineRepository: Repository<LeadTimeline>,
    entityManager: EntityManager,
  ) {
    super(leadTimelineRepository, entityManager);
  }
}
