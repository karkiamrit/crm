import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { UpdateTransactionsDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionsRepository } from './transaction.repository';
import { ExtendedFindOptions, User } from '@app/common';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async create(createTransactionsDto: CreateTransactionsDto, user: User) {
    const transaction = new Transaction(createTransactionsDto);
    transaction.userId = user.id;
    return await this.transactionsRepository.create(transaction);
  }

  async update(id: number, updateTransactionsDto: UpdateTransactionsDto) {
    return this.transactionsRepository.findOneAndUpdate(
      { where: { id: id } },
      updateTransactionsDto,
    );
  }

  async delete(id: number) {
    return this.transactionsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Transaction>) {
    return this.transactionsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.transactionsRepository.findOne({ id });
  }

  }

