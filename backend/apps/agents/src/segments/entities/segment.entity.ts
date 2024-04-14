import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Leads } from '../../leads/entities/lead.entity';


@Entity()
export class Segment extends AbstractEntity<Segment>{

  @Column()
  name: string;

  @ManyToMany(() => Leads, leads => leads.segments)
  lead: Leads[];

  @Column()
  userId: number;
}
