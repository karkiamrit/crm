import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Leads } from '../../leads/entities/lead.entity';


@Entity()
export class Segment extends AbstractEntity<Segment>{

  @Column()
  name: string;

  @ManyToMany(() => Leads, lead => lead.segments, { cascade: true, eager: true })
  @JoinTable()
  leads: Leads[];

  @Column()
  userId: number;
}
