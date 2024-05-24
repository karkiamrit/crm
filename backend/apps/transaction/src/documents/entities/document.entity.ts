import { AbstractEntity } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionTask } from '../../transaction-task/entities/transaction-task.entity';
import { DocumentStatus } from '../dto/enums/status.enum';

@Entity('transaction_document')
export class Document extends AbstractEntity<Document> {
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  documentFile: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  remarks: string;

  // @ManyToOne(() => TransactionTask, (lead) => lead.officialDocs, {
  //   eager: true,
  //   onDelete: 'CASCADE',
  //   nullable: true,
  // })
  // @JoinColumn({ name: 'taskId' })
  // task: TransactionTask;

  @OneToOne(() => TransactionTask, (task) => task.officialDocs, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'taskId' })
  task: TransactionTask;

  @Column('enum', {
    enum: DocumentStatus,
    default: DocumentStatus.INCOMPLETE,
  })
  status: DocumentStatus;
}
