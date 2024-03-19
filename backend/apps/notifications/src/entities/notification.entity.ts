import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Notification extends AbstractEntity<Notification> {
  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  subject: string;
}
