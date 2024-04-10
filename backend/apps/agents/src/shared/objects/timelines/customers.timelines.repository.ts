import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CustomerTimeline } from './timelines.entity';

@Injectable()
export class CustomerTimelineRepository extends AbstractRepository<CustomerTimeline> {
  protected readonly logger = new Logger(CustomerTimelineRepository.name);
  constructor(
    @InjectRepository(CustomerTimeline)
    customerTimelineRepository: Repository<CustomerTimeline>,
    entityManager: EntityManager,
  ) {
    super(customerTimelineRepository, entityManager);
  }
}
