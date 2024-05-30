import { AbstractEntity } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionTask } from '../../transaction-task/entities/transaction-task.entity';
import { DocumentStatus } from '../dto/enums/status.enum';
import { DocumentTimeline } from '../timelines/timelines.entity';

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

  @OneToMany(() => DocumentTimeline, (timeline) => timeline.document, {
    eager: true,
    onDelete: 'CASCADE',
  })
  timelines: DocumentTimeline[];

  @OneToOne(() => TransactionTask, (task) => task.officialDocs, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'taskId' })
  task: TransactionTask;

  @Column({ nullable: true })
  transactionId: number;

  @Column('enum', {
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;
}
