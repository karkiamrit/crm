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

  @Column({ type: 'float',nullable:true })
  subTotal: number;

  @Column({ type: 'float', nullable:true })
  tax: number;

  @Column({ default: InvoiceStatus.PENDING, type: 'enum', enum: InvoiceStatus , nullable:true})
  status: InvoiceStatus;

  @Column({ type: 'float', nullable:true })
  total: number;

  @Column({ nullable: true, type: 'float' })
  discount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({nullable:true})
  dueDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({nullable:true})
  remarks: string;

  @ManyToOne(() => Agent, { eager: true, onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'agentId', referencedColumnName: 'id' })
  agent: Agent;

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

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  leadAddress: string;

  @Column({ nullable: true })
  leadCountry: string;

  @Column({ nullable: true })
  sendorAddress: string;

  @Column({ nullable: true })
  sendorCountry: string;
}
