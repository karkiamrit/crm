import { AbstractEntity } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CustomerTimeline } from '../../shared/objects/timelines/timelines.entity';
import { Product } from '../../shared/objects/products/products.entity';
import { Service } from '../../shared/objects/services/services.entity';
import { LeadType } from '../../shared/data';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { Document } from '../../documents/entities/document.entity';
import { Tasks } from '../../tasks/entities/task.entity';
import { Segment } from '../../segments/entities/segment.entity';

@Entity()
export class Customers extends AbstractEntity<Customers> {
  @Column({ nullable: true })
  address: string;

  @Column({ default: LeadType.SOLE, type: 'enum', enum: LeadType })
  type: LeadType;

  @Column({ nullable: true })
  details: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  source: string; //eg: facebook, email etc

  @OneToMany(() => CustomerTimeline, (timeline) => timeline.customer, {
    eager: true,
    onDelete: 'CASCADE',
  })
  timelines: CustomerTimeline[];

  @OneToOne(() => Product, { eager: true, nullable: true, cascade: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @OneToMany(() => Tasks, (task) => task.customer, { nullable: true })
  tasks: Tasks[];

  @OneToOne(() => Service, { eager: true, nullable: true, cascade: true })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @OneToMany(() => Document, (document) => document.customer, {
    nullable: true,
  })
  officialDocs: Document[];

  @Column({ nullable: true })
  agentId: number;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'float', nullable: true })
  revenuePotential: number;

  @ManyToMany(() => Segment, (segment) => segment.leads, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  segments: Segment[];
}
