import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { AbstractEntity } from '@app/common';
import { Leads } from 'apps/agents/src/leads/entities/lead.entity';
import { Customers } from 'apps/agents/src/customers/entities/customer.entity';

export class Timeline extends AbstractEntity<Timeline> {
  @Column()
  attribute: string;

  @Column()
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  // Add optional lead and customer properties
  lead?: Leads;
  customer?: Customers;
}

@Entity()
export class LeadTimeline extends Timeline {
  @ManyToOne(() => Leads, (lead) => lead.timelines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: Leads; // Override the lead property to make it required
}

@Entity()
export class CustomerTimeline extends Timeline {
  @ManyToOne(() => Customers, (customer) => customer.timelines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customers; // Override the customer property to make it required
}
