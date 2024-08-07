import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Leads } from '../../leads/entities/lead.entity';
import { Customers } from '../../customers/entities/customer.entity';

@Entity()
export class Segment extends AbstractEntity<Segment> {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Leads, (leads) => leads.segments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  leads: Leads[];

  @ManyToMany(() => Leads, (leads) => leads.segments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  customers: Customers[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;
}
