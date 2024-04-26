import { AbstractEntity } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { LeadTimeline } from '../../shared/objects/timelines/timelines.entity';
import { Product } from '../../shared/objects/products/products.entity';
import { Service } from '../../shared/objects/services/services.entity';
import { Segment } from '../../segments/entities/segment.entity';
import { Document } from '../../documents/entities/document.entity';
import { LeadsStatus, LeadType } from '../../shared/data';
import { Tasks } from '../../tasks/entities/task.entity';

@Entity()
export class Leads extends AbstractEntity<Leads> {
  @Column({ nullable: true })
  address: string;

  @Column({ default: LeadType.SOLE, type: 'enum', enum: LeadType })
  type: LeadType;

  @Column({ nullable: true })
  details: string;

  @Column({
    type: 'enum',
    enum: LeadsStatus,
    default: LeadsStatus.NOTSET,
  })
  status: LeadsStatus;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({type: 'float', nullable:true})
  revenuePotential: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Tasks, (task) => task.lead)
  tasks: Tasks[];

  @Column({ nullable: true })
  source: string; //eg: facebook, email etc

  @OneToMany(() => LeadTimeline, (timeline) => timeline.lead, {
    eager: true,
    onDelete: 'CASCADE',
  })
  timelines: LeadTimeline[];

  @OneToOne(() => Product, { eager: true, nullable: true, cascade: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @OneToOne(() => Service, { eager: true, nullable: true, cascade: true })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  agentId: number;

  @ManyToMany(() => Segment, (segment) => segment.leads, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  segments: Segment[];

  @OneToMany(() => Document, (document) => document.lead, { nullable: true })
  officialDocs: Document[];
}
