import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsRepository extends AbstractRepository<Notification> {
  protected readonly logger = new Logger(NotificationsRepository.name);
  constructor(
    @InjectRepository(Notification)
    notificationsRepository: Repository<Notification>,
    entityManager: EntityManager,
  ) {
    super(notificationsRepository, entityManager);
  }
}
