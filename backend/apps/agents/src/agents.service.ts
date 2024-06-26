import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAgentsDto } from './dto/create-agent.dto';
import { UpdateAgentsDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { AgentsRepository } from './agent.repository';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, ExtendedFindOptions, Role, User } from '@app/common';
import { promisify } from 'util';
import { unlink } from 'fs';
import { randomUUID } from 'crypto';
import { join } from 'path';

@Injectable()
export class AgentsService {
  constructor(
    private readonly agentsRepository: AgentsRepository,
    @Inject(AUTH_SERVICE)
    private readonly usersService: ClientProxy,
  ) {}

  // async create(createAgentsDto: CreateAgentsDto, user:User) {
  //   const agent = new Agent(createAgentsDto);
  //   const role = new Role({name: "Agent"})
  //   user.roles.push
  //   this.usersService
  //       .send<User>('update_user', { where: { id: user.id }, user })
  //       .subscribe();
  //   return await this.agentsRepository.create(agent);
  // }

  async create(createAgentsDto: CreateAgentsDto, user: User) {
    const agent = new Agent(createAgentsDto);
    agent.userId = user.id;
    agent.reference_no = randomUUID();
    await this.agentsRepository.create(agent);

    // Create a new role object
    const role = 'Agent';
    const userId = user.id;
    // Send the update request to the user microservice
    this.usersService.send('update_user_role', { userId, role }).subscribe({
      next: (response) => console.log(`User updated successfully: ${response}`),
      error: (error) => console.error(`Failed to update user: ${error}`),
    });

    return agent;
  }

  async createAgentAdmin(createAgentsDto: CreateAgentsDto, id: number) {
    const agent = new Agent(createAgentsDto);
    agent.userId = id;
    agent.reference_no = randomUUID();
    await this.agentsRepository.create(agent);

    // Create a new role object
    const role = 'Agent';
    const userId = id;
    // Send the update request to the user microservice
    this.usersService.send('update_user_role', { userId, role }).subscribe({
      next: (response) => console.log(`User updated successfully: ${response}`),
      error: (error) => console.error(`Failed to update user: ${error}`),
    });

    return agent;
  }

  async update(id: number, updateAgentsDto: UpdateAgentsDto) {
    return this.agentsRepository.findOneAndUpdate(
      { where: { id: id } },
      updateAgentsDto,
    );
  }

  async delete(id: number) {
    return this.agentsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Agent>) {
    return this.agentsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.agentsRepository.findOne({ id });
  }

  async getOneByReferenceNo(referenceNo: string) {
    const agent = this.agentsRepository.findOne({ reference_no: referenceNo });
    return agent;
  }

  // async getUserByAgentId(
  //   agentId: number,
  //   options: ExtendedFindOptions<User>,
  // ): Promise<User[]> {
  //   return new Promise((resolve, reject) => {
  //     this.usersService
  //       .send<User[]>('get_all_users', { where: { agentId }, options })
  //       .subscribe({
  //         next: (users) => resolve(users),
  //         error: (error) => reject(error),
  //       });
  //   });
  // }

  async addDocuments(id: number, documents: string[]): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({ id });
    agent.documents = [...agent.documents, ...documents];
    return this.agentsRepository.findOneAndUpdate({ where: { id: id } }, agent);
  }

  async updateDocument(
    id: number,
    filename: string,
    newFilePath: string,
  ): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({ id });
    const index = agent.documents.findIndex((doc) => doc.includes(filename));
    if (index !== -1) {
      const unlinkAsync = promisify(unlink);
      await unlinkAsync(agent.documents[index]);
      agent.documents[index] = newFilePath;
    }
    return this.agentsRepository.findOneAndUpdate({ where: { id: id } }, agent);
  }

  async deleteDocument(id: number, filename: string): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({ id });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    const fullFilename = join('uploads', filename);
    const index = agent.documents.findIndex((doc) => doc === fullFilename);

    if (index !== -1) {
      const unlinkAsync = promisify(unlink);
      try {
        await unlinkAsync(fullFilename); // delete the file
      } catch (error) {
        throw new NotFoundException(`File ${filename} not found`);
      }

      agent.documents.splice(index, 1); // remove the file from the documents array

      await this.agentsRepository.create(agent); // save the updated agent
    }
    return agent;
  }

  async getAgentByUserId(id: number): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({ userId: id });
    return agent;
  }
}
