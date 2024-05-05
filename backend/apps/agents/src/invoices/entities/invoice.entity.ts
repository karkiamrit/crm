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

@Entity()
export class Invoice extends AbstractEntity<Invoice> {
  @Column({nullable:true})
  customerName: string;

  @Column({nullable: true})
  customerEmail: string;

  @Column({nullable: true})
  notes: string;

  @Column()
  subTotal: number;

  @Column()
  tax: number;

  @Column({default: InvoiceStatus.PENDING, type: 'enum', enum: InvoiceStatus})
  status: InvoiceStatus

  @Column()
  total: number;

  @Column({ nullable: true })
  discount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  dueDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  remarks: string;

  @ManyToOne(() => Agent, { eager: true, onDelete: 'CASCADE',nullable:true })
  @JoinColumn({ name: 'agentId', referencedColumnName: 'id' })
  agent: Agent;

  @ManyToOne(() => Customers, { eager: true, onDelete: 'CASCADE', nullable:true })
  @JoinColumn({ name: 'customerId', referencedColumnName: 'id' })
  customer: Customers;

  @OneToMany(() => Product, (product) => product.invoice, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'productId' })
  products: Product[];
}
