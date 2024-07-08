import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser, ExtendedFindOptions, User } from '@app/common';
import { Tasks } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';
import { LeadsService } from '../leads/leads.service';
import { AgentsService } from '../agents.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly leadsService: LeadsService,
    private readonly leadsRepository: LeadsService,
    private readonly agentsService: AgentsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Tasks> {
    const { leadId, customerId, ...rest } = createTaskDto;
    const task = new Tasks({ ...rest });
    const agent = await this.agentsService.getAgentByUserId(user.id);

    if (agent) {
      task.agent = agent;
    }
    if (leadId) {
      const lead = await this.leadsService.getOne(leadId);
      task.lead = lead;
    }
    task.dueDate = createTaskDto.dueDate;
    task.taskDesc = createTaskDto.taskDesc;
    task.priority = createTaskDto.priority;
    // task.subTasks = createTaskDto.subTasks;
    task.todoType = createTaskDto.todoType;
    task.reminderDate = createTaskDto.reminderDate;
    await this.leadsRepository.update(leadId,{updatedTime: new Date()});

    return await this.tasksRepository.create(task);

  }

  async findAll(options: ExtendedFindOptions<Tasks>) {
    options.relations = ['lead', 'customer'];
    return await this.tasksRepository.findAll(options);
  }

  async findOne(id: number): Promise<Tasks> {
    const task = await this.tasksRepository.findOne({ id });
    if (!task) {
      throw new NotFoundException(`Segment with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Tasks> {
    const task = await this.findOne(id);
    task.name = updateTaskDto.name || task.name;
    task.dueDate = updateTaskDto.dueDate || task.dueDate;
    task.taskDesc = updateTaskDto.taskDesc || task.taskDesc;
    task.priority = updateTaskDto.priority || task.priority;
    task.status = updateTaskDto.status || task.status;
    // task.subTasks = updateTaskDto.subTasks || task.subTasks;
    task.reminderDate = updateTaskDto.reminderDate || task.reminderDate;
    const updatedTask = await this.tasksRepository.findOneAndUpdate(
      { where: { id: task.id } },
      task,
    );
    if (updatedTask) {
      if (task.lead) {
        await this.leadsService.update(task.lead.id, { updatedTime: new Date() });
      }
    }
    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.tasksRepository.findOneAndDelete({ id });
  }
}
