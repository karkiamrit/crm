import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { UpdateTransactionsDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionsRepository } from './transaction.repository';
import { ExtendedFindOptions, User } from '@app/common';
import { CreateListingsDto } from './listing/dto/create-listing.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Listing } from './listing/entities/listing.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly transactionsRepository: TransactionsRepository
  ) {}

  async create(createListingsDto: CreateListingsDto, createTransactionDto: CreateTransactionsDto, user: User) {
    const queryRunner = this.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const listing = new Listing(createListingsDto);
      const createdListing = await queryRunner.manager.save(listing);

      const transaction = new Transaction(createTransactionDto);
      transaction.userId = user.id;
      transaction.listing = createdListing;
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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

  }

