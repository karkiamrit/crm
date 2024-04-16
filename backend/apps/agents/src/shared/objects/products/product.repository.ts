import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Product } from './products.entity';

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductRepository.name);
  constructor(
    @InjectRepository(Product)
    leadTimelineRepository: Repository<Product>,
    entityManager: EntityManager,
  ) {
    super(leadTimelineRepository, entityManager);
  }
}
