import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { AbstractEntity } from '@app/common';
import { Document } from '../entities/document.entity';

@Entity()
export class DocumentTimeline extends AbstractEntity<DocumentTimeline> {
  @Column()
  attribute: string;

  @Column()
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Document, (document) => document.timelines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column()
  taskId: number;

  @Column({ nullable: true })
  customerName: string;
}
