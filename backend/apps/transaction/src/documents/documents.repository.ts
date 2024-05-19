import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsRepository extends AbstractRepository<Document> {
  protected readonly logger = new Logger(DocumentsRepository.name);
  constructor(
    @InjectRepository(Document)
    documentsRepository: Repository<Document>,
    entityManager: EntityManager,
  ) {
    super(documentsRepository, entityManager);
  }
}
