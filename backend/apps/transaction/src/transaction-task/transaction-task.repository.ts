import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { TransactionTask } from './entities/transaction-task.entity';

@Injectable()
export class TransactionTaskRepository extends AbstractRepository<TransactionTask> {
  protected readonly logger = new Logger(TransactionTaskRepository.name);
  constructor(
    @InjectRepository(TransactionTask)
    transactionTasksRepository: Repository<TransactionTask>,
    entityManager: EntityManager,
  ) {
    super(transactionTasksRepository, entityManager);
  }
}
