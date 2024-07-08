import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { templateType } from '../dto/enums/template.type';
import { Campaign } from '../campaign/entities/campaign.entity';

@Entity()
export class Notification extends AbstractEntity<Notification> {
  @Column()
  title: string;

  @Column({ nullable: true })
  html_content: string;

  @Column({ nullable: true })
  text_content: string;

  @Column({ nullable: true })
  json_content: string;

  @Column({nullable:true})
  subject: string;

  @Column({ nullable: true })
  creatorId: number;

  @Column({
    type: 'enum',
    enum: templateType,
    default: templateType.NONDEFAULT,
  })
  type: templateType;

  @OneToMany(() => Campaign, (campaign) => campaign.notification)
  campaigns: Campaign[];
}
