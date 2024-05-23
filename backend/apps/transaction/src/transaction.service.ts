import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { UpdateTransactionsDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { ExtendedFindOptions, User } from '@app/common';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionsRepository: TransactionRepository
  ) {}

  async create( createTransactionDto: CreateTransactionsDto, user: User, logo: string) {
    try {
      const transaction = new Transaction(createTransactionDto);
      transaction.userId = user.id;
      transaction.logo = logo;
      return await this.transactionsRepository.create(transaction);
    } catch (error) {
      throw new Error(error);
    }
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

  async updateLogo(leadId: number, filePath: string): Promise<Transaction> {
    // const organization = await this.organizationsRepository.findOne({id: organizationId});
    const leads = await this.transactionsRepository.findOneAndUpdate(
      { where: { id: leadId } },
      { logo: filePath },
    );
    return leads;
  }

  }

