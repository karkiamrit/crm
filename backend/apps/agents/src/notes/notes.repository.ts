import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesRepository extends AbstractRepository<Note> {
  protected readonly logger = new Logger(NotesRepository.name);
  constructor(
    @InjectRepository(Note)
    leadsRepository: Repository<Note>,
    entityManager: EntityManager,
  ) {
    super(leadsRepository, entityManager);
  }
}
