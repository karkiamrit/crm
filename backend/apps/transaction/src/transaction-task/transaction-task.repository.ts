import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { TransactionTask } from './entities/transaction-task.entity';

@Injectable()
export class TransactionTasksRepository extends AbstractRepository<TransactionTask> {
  protected readonly logger = new Logger(TransactionTasksRepository.name);
  constructor(
    @InjectRepository(TransactionTask)
    transactionsRepository: Repository<TransactionTask>,
    entityManager: EntityManager,
  ) {
    super(transactionsRepository, entityManager);
  }
}
