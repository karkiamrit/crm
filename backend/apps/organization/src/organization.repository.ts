import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsRepository extends AbstractRepository<Organization> {
  protected readonly logger = new Logger(OrganizationsRepository.name);
  constructor(
    @InjectRepository(Organization)
    organizationsRepository: Repository<Organization>,
    entityManager: EntityManager,
  ) {
    super(organizationsRepository, entityManager);
  }
}
