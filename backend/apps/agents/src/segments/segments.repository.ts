import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Segment } from './entities/segment.entity';

@Injectable()
export class SegmentsRepository extends AbstractRepository<Segment> {
  protected readonly logger = new Logger(SegmentsRepository.name);
  constructor(
    @InjectRepository(Segment)
    segmentsRepository: Repository<Segment>,
    entityManager: EntityManager,
  ) {
    super(segmentsRepository, entityManager);
  }
}
