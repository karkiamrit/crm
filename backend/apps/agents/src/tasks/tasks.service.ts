import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser, ExtendedFindOptions, User } from '@app/common';
import { Tasks } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';
import { LeadsService } from '../leads/leads.service';
import { AgentsService } from '../agents.service';
import { CustomersService } from '../customers/customers.service';
import { LeadTimelineRepository } from '../shared/objects/timelines/leads.timelines.repository';
import { LeadTimeline } from '../shared/objects/timelines/timelines.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly leadsService: LeadsService,
    private readonly leadsRepository: LeadsService,
    private readonly agentsService: AgentsService,
    private readonly leadsTimelineRepository: LeadTimelineRepository,
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
    if(createTaskDto.startDate){
      task.startDate = createTaskDto.startDate;
    }
    else{
      task.startDate = createTaskDto.dueDate;

    }
    const timeline = new LeadTimeline({
      lead: task.lead,
      attribute: 'task',
      value: task.name as string, // Cast the value to string
      createdBy: user.email,
    });
    await this.leadsTimelineRepository.create(timeline);
    await this.leadsRepository.update(leadId, { updatedTime: new Date() },user);

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


  // async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Tasks> {
  //   const task = await this.findOne(id);
  //   task.name = updateTaskDto.name || task.name;
  //   task.dueDate = updateTaskDto.dueDate || task.dueDate;
  //   task.taskDesc = updateTaskDto.taskDesc || task.taskDesc;
  //   task.priority = updateTaskDto.priority || task.priority;
  //   task.status = updateTaskDto.status || task.status;
  //   task.todoType = updateTaskDto.todoType || task.todoType;
  //   // task.subTasks = updateTaskDto.subTasks || task.subTasks;
  //   task.reminderDate = updateTaskDto.reminderDate || task.reminderDate;
  //   const updatedTask = await this.tasksRepository.findOneAndUpdate(
  //     { where: { id: task.id } },
  //     task,
  //   );
  //   if (updatedTask) {
  //     if (task.lead) {
  //       await this.leadsService.update(task.lead.id, { updatedTime: new Date() });
  //     }
  //   }
  //   return updatedTask;
  // }

  async update(id: number, updateTaskDto: UpdateTaskDto, user:User): Promise<Tasks> {
    const task = await this.findOne(id);
    const properties = [
      'name',
      'dueDate',
      'startDate',
      'taskDesc',
      'priority',
      'status',
      'todoType',
      'reminderDate'
    ];
  
    for (const property of properties) {
      const newValue = updateTaskDto[property];
      const oldValue = task[property];
    
      if (newValue && (property === 'dueDate' || property === 'reminderDate' || property === 'startDate')) {
        // Convert dates to ISO strings before comparing
        if (new Date(newValue).toISOString() !== new Date(oldValue).toISOString()) {
          // Dates are different, create timeline
          const timeline = new LeadTimeline({
            lead: task.lead,
            attribute: 'task.'+property,
            value: newValue,
            previousValue: oldValue,
          });
          await this.leadsTimelineRepository.create(timeline);
        }
      } else if (newValue && newValue !== oldValue) {
        // For non-date properties, use the original comparison
        const timeline = new LeadTimeline({
          lead: task.lead,
          attribute: 'task.'+property,
          value: newValue,
          previousValue: oldValue,
        });
        await this.leadsTimelineRepository.create(timeline);
      }
    }
    const updateTask= new Tasks({ ...task, ...updateTaskDto });
    const updatedTask = await this.tasksRepository.findOneAndUpdate(
      { where: { id: task.id } },
      updateTask,
    );
    if (updatedTask && task.lead) {
      await this.leadsService.update(task.lead.id, { updatedTime: new Date() },user);
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
