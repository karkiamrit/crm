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
    private readonly agentsService: AgentsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Tasks> {
    const { leadId, customerId ,...rest} =createTaskDto;
    const task = new Tasks({...rest});
    const agent = await this.agentsService.getAgentByUserId(user.id);
    if(agent){
      task.agent = agent;
    }
    if(leadId){
      const lead = await this.leadsService.getOne(leadId);
      task.lead = lead;
    }
    if(customerId){
      const customer= await this.customersService.getOne(customerId);
      task.customer = customer;
    }
    task.dueDate = createTaskDto.dueDate;
    task.taskDesc = createTaskDto.taskDesc;
    task.priority = createTaskDto.priority;

    return this.tasksRepository.create(task);
  }

  async findAll(
    options: ExtendedFindOptions<Tasks>,
  ): Promise<{ data: Tasks[]; total: number }> {
    options.relations = ['leads'];
    const result = await this.tasksRepository.findAll(options);
    const data = result.data;
    const total = result.total;
    return { data, total };
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
    task.dueDate = updateTaskDto.dueDate || task.dueDate;
    task.taskDesc = updateTaskDto.taskDesc || task.taskDesc;
    task.priority = updateTaskDto.priority || task.priority;
    return this.tasksRepository.findOneAndUpdate({where:{id:task.id}}, task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.tasksRepository.findOneAndDelete(task);
  }
}