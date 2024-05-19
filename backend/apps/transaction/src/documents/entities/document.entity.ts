import { AbstractEntity } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionTask } from '../../transaction-task/entities/transaction-task.entity';

@Entity()
export class Document extends AbstractEntity<Document> {

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  documentFile: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TransactionTask, (lead) => lead.officialDocs, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'taskId' })
  task: TransactionTask;

}
