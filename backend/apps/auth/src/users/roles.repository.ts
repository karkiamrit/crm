import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class RolesRepository extends AbstractRepository<Role> {
  protected readonly logger = new Logger(RolesRepository.name);
  constructor(
    @InjectRepository(Role)
    rolesRepository: Repository<Role>,
    entityManager: EntityManager,
  ) {
    super(rolesRepository, entityManager);
  }
}
