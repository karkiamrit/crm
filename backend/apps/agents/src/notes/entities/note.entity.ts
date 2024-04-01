import { AbstractEntity } from '@app/common';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notes')
export class Note extends AbstractEntity<Note>{
  @Column()
  agentId: number;

  @Column()
  leadId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  content: string;
}