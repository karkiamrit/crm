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
import { Subject } from 'rxjs';

@Injectable()
export class LeadsService {
  private leadsSubject = new Subject<Leads>();

  constructor(
    private readonly leadsRepository: LeadsRepository,
  ) {
    this.leadsSubject.subscribe(async (newLead: Leads) => {
      const oldLead = await this.leadsRepository.findOne({ id: newLead.id });

      // Compare newLead and oldLead and get the changes
      const changes = this.getChanges(oldLead, newLead);

      // Create a new LeadTimeline for each change
      changes.forEach(async (change) => {
        const timeline = new LeadTimeline({
          lead: newLead,
          attribute: change.key,
          value: change.newValue,
        });
        newLead.timelines.push(timeline);
      });
      await this.leadsRepository.create(newLead);
    });
  }

  getChanges(oldLead: Leads, newLead: Leads) {
    const changes = [];

    // Compare each property of oldLead and newLead
    for (const key in oldLead) {
      if (oldLead[key] !== newLead[key]) {
        changes.push({
          key: key,
          oldValue: oldLead[key],
          newValue: newLead[key],
        });
      }
    }

    return changes;
  }

  async create(createLeadDto: CreateLeadDto, user: User) {
    // Convert CreateTimelineInputDTO[] to LeadTimeline[]
    let product: Product, service: Service, timelines: LeadTimeline[];
    // Convert CreateProductInputDTO to Product
    if (createLeadDto.product) {
      product = new Product(createLeadDto.product);
    }
    if (createLeadDto.service) {
      service = new Service(createLeadDto.service);
    }
    if (createLeadDto.timelines) {
      timelines = createLeadDto.timelines.map(
        (timelineDto) => new LeadTimeline(timelineDto),
      );
    }
    // Create a new Leads entity
    const lead = new Leads({
      ...createLeadDto,
      service,
      timelines,
      product,
    });

    await this.leadsRepository.create(lead);

    return lead;
  }

  async update(id: number, updateLeadsDto: UpdateLeadDto) {
    // Find the lead
    const lead = await this.leadsRepository.findOne({ id });
  
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  
    // Convert UpdateProductInputDTO to Product
    if (updateLeadsDto.product) {
      lead.product = new Product(updateLeadsDto.product);
    }
  
    // Convert UpdateServiceInputDTO to Service
    if (updateLeadsDto.service) {
      lead.service = new Service(updateLeadsDto.service);
    }
  
    // Convert UpdateTimelineInputDTO[] to LeadTimeline[]
    if (updateLeadsDto.timelines) {
      lead.timelines = updateLeadsDto.timelines.map(
        (timelineDto) => new LeadTimeline(timelineDto),
      );
    }
  
    // Update the other fields
    lead.address = updateLeadsDto.address ?? lead.address;
    lead.details = updateLeadsDto.details ?? lead.details;
    lead.status = updateLeadsDto.status ?? lead.status;
    lead.phone = updateLeadsDto.phone ?? lead.phone;
    lead.email = updateLeadsDto.email ?? lead.email;
    lead.name = updateLeadsDto.name ?? lead.name;
    lead.priority = updateLeadsDto.priority ?? lead.priority;
    lead.source = updateLeadsDto.source ?? lead.source;
    lead.documents = updateLeadsDto.documents ?? lead.documents;
  
    // Save the updated lead
    await this.leadsRepository.findOneAndUpdate({id}, lead);
  
    return lead;
  }

  async delete(id: number) {
    return this.leadsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Leads>): Promise<Leads[]> {
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
    const index = lead.documents.findIndex((doc) => doc.includes(filename));
    if (index !== -1) {
      const unlinkAsync = promisify(unlink);
      await unlinkAsync(lead.documents[index]); // delete the file
      lead.documents.splice(index, 1); // remove the file from the documents array
    }
    return this.leadsRepository.findOneAndUpdate({ id }, lead);
  }

}
