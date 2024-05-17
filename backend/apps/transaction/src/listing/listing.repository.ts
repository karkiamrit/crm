import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ListingsRepository extends AbstractRepository<Listing> {
  protected readonly logger = new Logger(ListingsRepository.name);
  constructor(
    @InjectRepository(Listing)
    transactionsRepository: Repository<Listing>,
    entityManager: EntityManager,
  ) {
    super(transactionsRepository, entityManager);
  }
}
