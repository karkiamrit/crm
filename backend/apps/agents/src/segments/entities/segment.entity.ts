import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Leads } from '../../leads/entities/lead.entity';


@Entity()
export class Segment extends AbstractEntity<Segment>{

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Leads, leads => leads.segments)
  leads: Leads[];

  @Column()
  userId: number;
}
