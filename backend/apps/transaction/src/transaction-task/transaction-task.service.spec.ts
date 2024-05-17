import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTaskService } from './transaction-task.service';

describe('TransactionTaskService', () => {
  let service: TransactionTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionTaskService],
    }).compile();

    service = module.get<TransactionTaskService>(TransactionTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
