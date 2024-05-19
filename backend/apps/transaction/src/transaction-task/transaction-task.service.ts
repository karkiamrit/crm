import { Injectable } from '@nestjs/common';
import { CreateTransactionTaskDto } from './dto/create-transaction-task.dto';
import { UpdateTransactionTaskDto } from './dto/update-transaction-task.dto';
import { TransactionTask } from './entities/transaction-task.entity';
import { TransactionTasksRepository } from './transaction-task.repository';
import { ExtendedFindOptions } from '@app/common';
import { TransactionService } from '../transaction.service';

@Injectable()
export class TransactionTaskService {
  constructor(
    private readonly transactionTasksRepository: TransactionTasksRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(createTransactionTasksDto: CreateTransactionTaskDto) {
    const {transactionId, ...rest} = createTransactionTasksDto;
    const transactionTask = new TransactionTask(rest);
    const transaction = await this.transactionService.getOne(transactionId);
    if(!transaction){
      throw new Error('Transaction not found');
    }
    transactionTask.transaction = transaction;
    return await this.transactionTasksRepository.create(transactionTask);
  }

  async update(id: number, updateTransactionTasksDto: UpdateTransactionTaskDto) {
    return this.transactionTasksRepository.findOneAndUpdate(
      { where: { id: id } },
      updateTransactionTasksDto,
    );
  }

  async delete(id: number) {
    return this.transactionTasksRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<TransactionTask>) {
    return this.transactionTasksRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.transactionTasksRepository.findOne({ id });
  }

  }

