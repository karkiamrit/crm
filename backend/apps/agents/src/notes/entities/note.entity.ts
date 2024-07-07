import { AbstractEntity } from '@app/common';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tasks } from '../../tasks/entities/task.entity';

@Entity('notes')
export class Note extends AbstractEntity<Note> {
  @Column()
  userId: number;

  @Column()
  author: string;

  @ManyToOne(() => Tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Tasks;

  // @ManyToOne(() => Customers, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'customerId' })
  // customer: Customers;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'text' })
  content: string;
}
