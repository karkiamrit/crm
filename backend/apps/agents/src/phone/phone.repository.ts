import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Phone } from './entities/phone.entity';

@Injectable()
export class PhonesRepository extends AbstractRepository<Phone> {
  protected readonly logger = new Logger(PhonesRepository.name);
  constructor(
    @InjectRepository(Phone)
    phonesRepository: Repository<Phone>,
    entityManager: EntityManager,
  ) {
    super(phonesRepository, entityManager);
  }
}
