import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Leads } from './entities/lead.entity';
import { LeadsRepository } from './leads.repository';
import { ExtendedFindOptions, User } from '@app/common';
import { promisify } from 'util';
import { unlink } from 'fs';
import { LeadTimeline } from './timelines/timelines.entity';
import { Product } from './products/products.entity';
import { Service } from './services/services.entity';
import { LeadTimelineRepository } from './timelines/timelines.repository';
import { AgentsService } from '../agents.service';
import { join } from 'path';
import { Agent } from '../entities/agent.entity';

@Injectable()
export class LeadsService {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly leadTimelineRepository: LeadTimelineRepository,
    private readonly agentService: AgentsService,
  ) {}

  async create(createLeadDto: CreateLeadDto, agent: Agent) {
    // Convert CreateTimelineInputDTO[] to LeadTimeline[]
    let product: Product, service: Service, timelines: LeadTimeline[];
    // Convert CreateProductInputDTO to Product
    if (createLeadDto.product) {
      product = new Product(createLeadDto.product);
    }
    if (createLeadDto.service) {
      service = new Service(createLeadDto.service);
    }
    // Create a new Leads entity
    const lead = new Leads({
      ...createLeadDto,
      service,
      product,
    });
    console.log(agent);
 
    lead.agentId = agent.id;

 
    await this.leadsRepository.create(lead);

    return lead;
  }

  async update(id: number, updateLeadsDto: UpdateLeadDto) {
    // Find the lead
    const lead = await this.leadsRepository.findOne({ id });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    // List of attributes to check for changes
    const attributes = [
      'product',
      'service',
      'address',
      'details',
      'status',
      'phone',
      'email',
      'name',
      'priority',
      'source',
      'documents',
    ];

    // Check each attribute for changes
    for (const attribute of attributes) {
      if (
        updateLeadsDto[attribute] &&
        updateLeadsDto[attribute] !== lead[attribute]
      ) {
        // Update the attribute
        lead[attribute] = updateLeadsDto[attribute];

        // Create a new LeadTimeline for the updated attribute
        const timeline = new LeadTimeline({
          lead: lead,
          attribute: attribute,
          value: updateLeadsDto[attribute],
        });

        // Save the LeadTimeline entity to the database
        await this.leadTimelineRepository.create(timeline);

        // Add the LeadTimeline entity to the timelines array of the lead
        lead.timelines.push(timeline);
      }
    }

    // Save the updated lead
    await this.leadsRepository.create(lead);

    // Create a new object that omits the lead property from each LeadTimeline in lead.timelines
    const leadToReturn = {
      ...lead,
      timelines: lead.timelines.map((timeline) => {
        const { lead, ...timelineWithoutLead } = timeline;
        return timelineWithoutLead;
      }),
    };

    return leadToReturn;
  }

  async delete(id: number) {
    return this.leadsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Leads>): Promise<Leads[]> {
    return this.leadsRepository.findAll(options);
  }

  async findAllLeadsOfAgent(
    options: ExtendedFindOptions<Leads>,
  ): Promise<Leads[]> {
    return this.leadsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.leadsRepository.findOne({ id });
  }

  async addDocuments(id: number, documents: string[]): Promise<Leads> {
    const lead = await this.leadsRepository.findOne({ id });
    lead.documents = [...lead.documents, ...documents];
    return this.leadsRepository.findOneAndUpdate({ id }, lead);
  }

  async updateDocument(
    id: number,
    filename: string,
    newFilePath: string,
  ): Promise<Leads> {
    const lead = await this.leadsRepository.findOne({ id });
    const index = lead.documents.findIndex((doc) => doc.includes(filename));
    if (index !== -1) {
      const unlinkAsync = promisify(unlink);
      await unlinkAsync(lead.documents[index]); // delete the old file
      lead.documents[index] = newFilePath; // replace with the new file
    }
    return this.leadsRepository.findOneAndUpdate({ id }, lead);
  }

  async deleteDocument(id: number, filename: string): Promise<Leads> {
    const lead = await this.leadsRepository.findOne({ id });

    if (!lead) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    const fullFilename = join('uploads', filename);
    const index = lead.documents.findIndex((doc) => doc === fullFilename);

    if (index !== -1) {
      const unlinkAsync = promisify(unlink);
      try {
        await unlinkAsync(fullFilename); // delete the file
      } catch (error) {
        throw new NotFoundException(`File ${filename} not found`);
      }

      lead.documents.splice(index, 1); // remove the file from the documents array

      await this.leadsRepository.create(lead); // save the updated agent
    }

    return lead;
  }
}
