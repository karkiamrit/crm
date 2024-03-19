import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Otp } from './entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class OtpRepository extends AbstractRepository<Otp> {
  protected readonly logger = new Logger(OtpRepository.name);
  constructor(
    @InjectRepository(Otp)
    otpRepository: Repository<Otp>,
    entityManager: EntityManager,
  ) {
    super(otpRepository, entityManager);
  }
}
