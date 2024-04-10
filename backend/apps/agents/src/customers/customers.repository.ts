import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Customers } from './entities/customer.entity';

@Injectable()
export class CustomersRepository extends AbstractRepository<Customers> {
  protected readonly logger = new Logger(CustomersRepository.name);
  constructor(
    @InjectRepository(Customers)
    customersRepository: Repository<Customers>,
    entityManager: EntityManager,
  ) {
    super(customersRepository, entityManager);
  }
}
