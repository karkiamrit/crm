import { AbstractEntity } from '@app/common';
import { Column, Entity, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Entity()
export class Campaign extends AbstractEntity<Campaign> {
  @Column()
  title: string;

  @Column()
  description: string; 
  
  @Column()
  segmentId: number; // Change type to number

  @Column()
  segmentName: string; 

  @Column({nullable:true})
  sendTime: Date; // Add sendTime field

  @ManyToOne(() => Notification, notification => notification.campaigns)
  @JoinColumn({ name: 'notificationId' })
  notification: Notification;

  @CreateDateColumn()
  createdAt: Date;
}