import { AbstractEntity } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { listingStatus, transactionStatus, transactionType } from '../dto/enums';
import { Listing } from '../listing/entities/listing.entity';
import { TransactionTask } from '../transaction-task/entities/transaction-task.entity';

@Entity()
export class Transaction extends AbstractEntity<Transaction> {
  @Column('enum', {
    enum: transactionStatus,
    default: transactionStatus.UNDER_CONTRACT,
  })
  status: transactionStatus;

  @Column('enum', {
    enum: listingStatus,
    default: listingStatus.LISTED,
  })
  listingStatus: listingStatus;

  @Column({type:'float', nullable: true})
  listingPrice: number;

  @Column()
  propertyType: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  listingAddress: string;

  @Column()
  propertyStatus: string;

  @Column('enum', {
    nullable: true,
    enum: transactionType,
    default: transactionType.PURCHASE,
  })
  type: transactionType;

  @Column()
  toBuyer: boolean;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  closingDate: Date;

  @OneToMany(() => TransactionTask, (task) => task.transaction, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true
  })
  tasks: TransactionTask[];
}
