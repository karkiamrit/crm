import { AbstractEntity } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { TransactionTask } from '../transaction-task/entities/transaction-task.entity';

@Entity()
export class Transaction extends AbstractEntity<Transaction> {
  // @Column( {
  //   type: 'enum',
  //   enum: transactionStatus,
  //   default: transactionStatus.UNDER_CONTRACT,
  // })
  // status: transactionStatus;

  // @Column( {
  //   type: 'enum',
  //   enum: listingStatus,
  //   default: listingStatus.STARTED,
  // })
  // listingStatus: listingStatus;

  // @Column({type:'float', nullable: true})
  // listingPrice: number;

  // @Column({nullable: true})
  // propertyType: string;

  // @Column({ nullable: true })
  // logo: string;

  @Column({ nullable: true })
  purpose: string;

  @Column()
  leadId: number;

  // @Column({nullable: true})
  // propertyStatus: string;

  // @Column({
  //   type: 'enum',
  //   nullable: true,
  //   enum: TransactionType,
  //   default: TransactionType.PURCHASE,
  // })
  // type: TransactionType;

  // @Column()
  // toBuyer: boolean;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  // @Column({ nullable: true })
  // closingDate: Date;

  @OneToMany(() => TransactionTask, (task) => task.transaction, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  tasks: TransactionTask[];
}
