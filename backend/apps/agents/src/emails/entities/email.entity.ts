
import { AbstractEntity } from '@app/common';
import {
    Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Leads } from '../../leads/entities/lead.entity';
import { EmailStatus } from '../dto/enums/status.enum';

@Entity()
export class Email extends AbstractEntity<Document> {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Leads, (lead) => lead.officialDocs, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'leadId' })
  lead: Leads;

  @Column({
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.PENDING,
  })
  status: EmailStatus;

  @Column({nullable:true})
  subject:string;
}
