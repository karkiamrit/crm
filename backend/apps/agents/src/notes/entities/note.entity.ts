import { AbstractEntity } from '@app/common';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Leads } from '../../leads/entities/lead.entity';
import { Customers } from '../../customers/entities/customer.entity';

@Entity('notes')
export class Note extends AbstractEntity<Note> {
  @Column()
  userId: number;

  @Column()
  author: string;

  @ManyToOne(() => Leads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: Leads;

  @ManyToOne(() => Customers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: Customers;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'text' })
  content: string;
}
