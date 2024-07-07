import { ForbiddenException, Injectable } from '@nestjs/common';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ExtendedFindOptions, User } from '@app/common';
import { NotesRepository } from './notes.repository';
import { CustomersService } from '../customers/customers.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    private readonly taskService: TasksService,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    try {
      const content = createNoteDto.content;
      const note = new Note({ content });
      if (createNoteDto.taskId) {
        const taskId = createNoteDto.taskId;
        const task = await this.taskService.findOne(taskId);
        note.task = task;
      }
      note.userId = user.id;

      note.author = user.email.split('@')[0];
      return this.notesRepository.create(note);
    } catch (error) {
      console.error(`Failed to create note: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, user: User) {
    try {
      const note = await this.notesRepository.findOne({ id });
      if (!note) {
        throw new Error(`Note with ID ${id} not found`);
      }

      if (
        note.userId !== user.id &&
        !user.roles.some((role) => role.name === 'Admin')
      ) {
        throw new ForbiddenException(
          `You are not authorized to update this note`,
        );
      }
      note.content = updateNoteDto.content;
      return this.notesRepository.findOneAndUpdate({ where: { id } }, note);
    } catch (e) {
      throw e;
    }
  }

  async delete(id: number) {
    return this.notesRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Note>) {
    options.relations = ['task'];
    return this.notesRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.notesRepository.findOne({ id });
  }
}
