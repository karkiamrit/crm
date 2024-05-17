import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTaskController } from './transaction-task.controller';
import { TransactionTaskService } from './transaction-task.service';

describe('TransactionTaskController', () => {
  let controller: TransactionTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionTaskController],
      providers: [TransactionTaskService],
    }).compile();

    controller = module.get<TransactionTaskController>(TransactionTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
