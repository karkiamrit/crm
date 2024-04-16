import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesRepository extends AbstractRepository<Invoice> {
  protected readonly logger = new Logger(InvoicesRepository.name);
  constructor(
    @InjectRepository(Invoice)
    invoicesRepository: Repository<Invoice>,
    entityManager: EntityManager,
  ) {
    super(invoicesRepository, entityManager);
  }
}
