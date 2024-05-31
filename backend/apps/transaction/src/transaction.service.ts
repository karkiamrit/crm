import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { UpdateTransactionsDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { ExtendedFindOptions, User } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionsRepository: TransactionRepository,
    private readonly configService: ConfigService,
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

  async generateUploadUrl(transactionId: number): Promise<string> {
    const payload = { transactionId };
    const token = sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: '24h',
    }); // The token expires in 24 hour
    const url = `${process.env.FRONTEND_URL}/transaction/${transactionId}?token=${token}`;
    return url;
  }
  }

