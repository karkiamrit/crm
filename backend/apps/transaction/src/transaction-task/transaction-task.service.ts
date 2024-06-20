import { Injectable } from '@nestjs/common';
import { CreateTransactionTaskDto } from './dto/create-transaction-task.dto';
import { UpdateTransactionTaskDto } from './dto/update-transaction-task.dto';
import { TransactionTask } from './entities/transaction-task.entity';
import { TransactionTaskRepository } from './transaction-task.repository';
import { ExtendedFindOptions } from '@app/common';
import { TransactionRepository } from '../transaction.repository';

@Injectable()
export class TransactionTaskService {
  constructor(
    private readonly transactionTasksRepository: TransactionTaskRepository,
    private readonly transactionsRepository: TransactionRepository,
  ) {}

  async create(createTransactionTasksDto: CreateTransactionTaskDto) {
    const {transactionId, ...rest} = createTransactionTasksDto;
    const transactionTask = new TransactionTask(rest);
    const transaction = await this.transactionsRepository.findOne({id: transactionId});
    if(!transaction){
      throw new Error('Transaction not found');
    }
    transactionTask.transaction = transaction;
    transactionTask.leadId = transaction.leadId;
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
    options.relations =['transaction']
    return this.transactionTasksRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.transactionTasksRepository.findOne({ id }, ['officialDocs']);
  }

  }

