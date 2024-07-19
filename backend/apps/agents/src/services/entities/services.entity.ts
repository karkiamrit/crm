import { AbstractEntity } from '@app/common';
import { Leads } from 'apps/agents/src/leads/entities/lead.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Service extends AbstractEntity<Service> {
  @Column({ nullable: true })
  name: string;

  @Column({ type: 'json', nullable: true })
  attributes: Record<string, any>;

  @ManyToOne(() => Leads, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'leadId' })
  lead: Leads;

}
