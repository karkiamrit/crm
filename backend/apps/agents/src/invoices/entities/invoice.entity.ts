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

@Entity()
export class Invoice extends AbstractEntity<Invoice> {
  @Column()
  subTotal: number;

  @Column()
  tax: number;

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

  @ManyToOne(() => Agent, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentId', referencedColumnName: 'id' })
  agent: Agent;

  @ManyToOne(() => Customers, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId', referencedColumnName: 'id' })
  customer: Customers;

  @OneToMany(() => Product, (product) => product.invoice, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'productId' })
  products: Product[];
}
