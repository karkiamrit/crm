import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Campaign } from './entities/campaign.entity';

@Injectable()
export class CampaignsRepository extends AbstractRepository<Campaign> {
  protected readonly logger = new Logger(CampaignsRepository.name);
  constructor(
    @InjectRepository(Campaign)
    notificationsRepository: Repository<Campaign>,
    entityManager: EntityManager,
  ) {
    super(notificationsRepository, entityManager);
  }
}
