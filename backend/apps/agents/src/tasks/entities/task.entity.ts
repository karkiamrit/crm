import { AbstractEntity } from '@app/common';
import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Priority } from '../../shared/data';
import { Agent } from '../../entities/agent.entity';
import { Customers } from '../../customers/entities/customer.entity';
import { Leads } from '../../leads/entities/lead.entity';

@Entity()
export class Tasks extends AbstractEntity<Tasks> {
  @Column()
  dueDate: Date;

  @Column()
  name: string;

  @Column()
  taskDesc: string;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.LOW,
  })
  priority: Priority;

  @ManyToOne(() => Agent, { nullable: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @ManyToOne(() => Customers, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customers;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Leads, { nullable: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: Leads;
}
