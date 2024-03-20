import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Leads } from './entities/lead.entity';

@Injectable()
export class LeadsRepository extends AbstractRepository<Leads> {
  protected readonly logger = new Logger(LeadsRepository.name);
  constructor(
    @InjectRepository(Leads)
    leadsRepository: Repository<Leads>,
    entityManager: EntityManager,
  ) {
    super(leadsRepository, entityManager);
  }
}
