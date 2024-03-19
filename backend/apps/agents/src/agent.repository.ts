import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentsRepository extends AbstractRepository<Agent> {
  protected readonly logger = new Logger(AgentsRepository.name);
  constructor(
    @InjectRepository(Agent)
    agentsRepository: Repository<Agent>,
    entityManager: EntityManager,
  ) {
    super(agentsRepository, entityManager);
  }
}
