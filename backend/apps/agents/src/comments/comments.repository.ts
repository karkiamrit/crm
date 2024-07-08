import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsRepository extends AbstractRepository<Comment> {
  protected readonly logger = new Logger(CommentsRepository.name);
  constructor(
    @InjectRepository(Comment)
    leadsRepository: Repository<Comment>,
    entityManager: EntityManager,
  ) {
    super(leadsRepository, entityManager);
  }
}
