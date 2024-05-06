import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Entity()
export class Campaign extends AbstractEntity<Campaign> {
  @Column()
  title: string;

  @Column()
  description: string; 
  
  @Column()
  segmentId: number; // Change type to number

  @OneToOne(() => Notification) // Establish one-to-one relationship with Notification
  @JoinColumn({ name: 'notificationId'}) // Specify that this entity is the owner of the relationship
  notification: Notification; // Add notification field
}