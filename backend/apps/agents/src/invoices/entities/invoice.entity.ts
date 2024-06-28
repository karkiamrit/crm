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
import { Product } from '../../shared/objects/products/products.entity';
import { Agent } from '../../entities/agent.entity';
import { Customers } from '../../customers/entities/customer.entity';
import { InvoiceStatus } from '../../shared/data/enums/invoice.status.enum';
import { Leads } from '../../leads/entities/lead.entity';

@Entity()
export class Invoice extends AbstractEntity<Invoice> {
  @Column({ nullable: true })
  leadName: string;

  @Column({ nullable: true })
  leadEmail: string;

  @Column({ nullable: true })
  leadOrganization: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'float' })
  subTotal: number;

  @Column({ type: 'float' })
  tax: number;

  @Column({ default: InvoiceStatus.PENDING, type: 'enum', enum: InvoiceStatus })
  status: InvoiceStatus;

  @Column({ type: 'float' })
  total: number;

  @Column({ nullable: true, type: 'float' })
  discount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  dueDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  remarks: string;

  @ManyToOne(() => Agent, { eager: true, onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'agentId', referencedColumnName: 'id' })
  agent: Agent;

  // @ManyToOne(() => Customers, { eager: true, onDelete: 'CASCADE', nullable:true })
  // @JoinColumn({ name: 'customerId', referencedColumnName: 'id' })
  // customer: Customers;

  @ManyToOne(() => Leads, { eager: true, onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'leadId', referencedColumnName: 'id' })
  lead: Leads;

  @OneToMany(() => Product, (product) => product.invoice, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'productId' })
  products: Product[];

  @Column({ nullable: true })
  sendorName: string;

  @Column({ nullable: true })
  sendorEmail: string;

  @Column({ nullable: true })
  sendorOrganization: string;
}
