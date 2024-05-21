import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionRepository extends AbstractRepository<Transaction> {
  protected readonly logger = new Logger(TransactionRepository.name);
  constructor(
    @InjectRepository(Transaction)
    transactionsRepository: Repository<Transaction>,
    entityManager: EntityManager,
  ) {
    super(transactionsRepository, entityManager);
  }
}
