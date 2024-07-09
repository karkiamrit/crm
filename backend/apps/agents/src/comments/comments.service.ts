import { ForbiddenException, Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ExtendedFindOptions, User } from '@app/common';
import { CommentsRepository } from './comments.repository';
import { TasksService } from '../tasks/tasks.service';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly taskService: TasksService,
    private readonly notesService: NotesService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    try {
      const content = createCommentDto.content;
      const comment = new Comment({ content });
      switch (true) {
        case Boolean(createCommentDto.taskId && createCommentDto.subTaskId):
          throw new Error(
            'You cannot create a comment for both a task and a subtask at the same time',
          );
        case Boolean(createCommentDto.taskId):
          const taskId = createCommentDto.taskId;
          const task = await this.taskService.findOne(taskId);
          comment.task = task;
          break;
        case Boolean(createCommentDto.subTaskId):
          const noteId = createCommentDto.subTaskId;
          const subTask = await this.notesService.getOne(noteId);
          comment.subTask = subTask;
          break;
      }
      comment.userId = user.id;
      comment.author = user.email.split('@')[0];
      return this.commentsRepository.create(comment);
    } catch (error) {
      console.error(`Failed to create comment: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: User) {
    try {
      const comment = await this.commentsRepository.findOne({ id });
      if (!comment) {
        throw new Error(`Comment with ID ${id} not found`);
      }

      if (
        comment.userId !== user.id &&
        !user.roles.some((role) => role.name === 'Admin')
      ) {
        throw new ForbiddenException(
          `You are not authorized to update this comment`,
        );
      }
      comment.content = updateCommentDto.content;
      return this.commentsRepository.findOneAndUpdate(
        { where: { id } },
        comment,
      );
    } catch (e) {
      throw e;
    }
  }

  async delete(id: number) {
    return this.commentsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Comment>) {
    options.relations=['task','subTask']
    return this.commentsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.commentsRepository.findOne({ id });
  }
}
