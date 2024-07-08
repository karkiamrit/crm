import { AbstractEntity } from '@app/common';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tasks } from '../../tasks/entities/task.entity';
import { Note } from '../../notes/entities/note.entity';

@Entity('comments')
export class Comment extends AbstractEntity<Comment> {
  @Column()
  userId: number;

  @Column()
  author: string;

  @ManyToOne(() => Tasks, { onDelete: 'CASCADE', nullable: true})
  @JoinColumn({ name: 'taskId' })
  task: Tasks;

  @ManyToOne(() => Note, { onDelete: 'CASCADE', nullable: true})
  @JoinColumn({ name: 'noteId' })
  subTask: Note;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'text' })
  content: string;
}
