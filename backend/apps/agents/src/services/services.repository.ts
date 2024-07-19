import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Service } from './entities/services.entity';

@Injectable()
export class ServicesRepository extends AbstractRepository<Service> {
  protected readonly logger = new Logger(ServicesRepository.name);
  constructor(
    @InjectRepository(Service)
    serviceRepository: Repository<Service>,
    entityManager: EntityManager,
  ) {
    super(serviceRepository, entityManager);
  }
}
