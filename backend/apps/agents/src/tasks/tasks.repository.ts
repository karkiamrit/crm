import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Tasks } from './entities/task.entity';

@Injectable()
export class TasksRepository extends AbstractRepository<Tasks> {
  protected readonly logger = new Logger(TasksRepository.name);
  constructor(
    @InjectRepository(Tasks)
    tasksRepository: Repository<Tasks>,
    entityManager: EntityManager,
  ) {
    super(tasksRepository, entityManager);
  }
}
