import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Notification extends AbstractEntity<Notification> {
  @Column()
  title: string;

  @Column({nullable:true})
  html_content: string;

  @Column({nullable:true})
  text_content: string;

  @Column()
  subject: string;
}