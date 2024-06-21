import { AbstractEntity } from '@app/common';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Priority } from '../../shared/data';
import { Agent } from '../../entities/agent.entity';
import { Customers } from '../../customers/entities/customer.entity';
import { Leads } from '../../leads/entities/lead.entity';
import { TaskType } from '../../shared/data/enums/task-type.enum';
import { TaskStatus } from '../dto/enums/task-status.enum';

@Entity()
export class Tasks extends AbstractEntity<Tasks> {
  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  startDate: Date;

  @Column()
  name: string;

  @Column()
  taskDesc: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.LOW,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.LEAD,
  })
  taskType: TaskType;

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
