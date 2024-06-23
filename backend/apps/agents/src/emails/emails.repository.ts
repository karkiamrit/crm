import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Email } from './entities/email.entity';

@Injectable()
export class EmailsRepository extends AbstractRepository<Email> {
  protected readonly logger = new Logger(EmailsRepository.name);
  constructor(
    @InjectRepository(Email)
    emailsRepository: Repository<Email>,
    entityManager: EntityManager,
  ) {
    super(emailsRepository, entityManager);
  }
}
