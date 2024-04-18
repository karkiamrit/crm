import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Leads } from './entities/lead.entity';
import { LeadsRepository } from './leads.repository';
import { ExtendedFindOptions, User } from '@app/common';

import { AgentsService } from '../agents.service';
import { Agent } from '../entities/agent.entity';
import { Service } from '../shared/objects/services/services.entity';
import {
  CustomerTimeline,
  LeadTimeline,
} from '../shared/objects/timelines/timelines.entity';
import { Product } from '../shared/objects/products/products.entity';
import { LeadTimelineRepository } from '../shared/objects/timelines/leads.timelines.repository';
import { CustomerTimelineRepository } from '../shared/objects/timelines/customers.timelines.repository';
import { Customers } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';
import { LeadsStatus } from '../shared/data';

@Injectable()
export class LeadsService {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly leadTimelineRepository: LeadTimelineRepository,
    private readonly agentService: AgentsService,
    private readonly customerTimelineRepository: CustomerTimelineRepository,
    private readonly customerService: CustomersService,
  ) {}

  async create(createLeadDto: CreateLeadDto, agent?: Agent) {
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
    if (agent) {
      lead.agentId = agent.id;
    }

    await this.leadsRepository.create(lead);

    return lead;
  }

  async createMany(createLeadDtos: CreateLeadDto[]) {
    const leads = createLeadDtos.map(dto => {
      let product: Product, service: Service;
      if (dto.product) {
        product = new Product(dto.product);
      }
      if (dto.service) {
        service = new Service(dto.service);
      }
      return new Leads({
        ...dto,
        service,
        product,
      });
    });
  
    await this.leadsRepository.createMany(leads);
  
    return leads;
  }

  // async update(id: number, updateLeadsDto: UpdateLeadDto) {
  //   // Find the lead
  //   const lead = await this.leadsRepository.findOne({ id });

  //   if (!lead) {
  //     throw new NotFoundException(`Lead with ID ${id} not found`);
  //   }

  //   // List of attributes to check for changes
  //   const attributes = [
  //     'product',
  //     'service',
  //     'address',
  //     'details',
  //     'status',
  //     'phone',
  //     'email',
  //     'name',
  //     'priority',
  //     'source',
  //     'documents',
  //   ];

  //   // Check each attribute for changes
  //   for (const attribute of attributes) {
  //     if (
  //       updateLeadsDto[attribute] &&
  //       updateLeadsDto[attribute] !== lead[attribute]
  //     ) {
  //       // Update the attribute
  //       lead[attribute] = updateLeadsDto[attribute];

  //       // Create a new LeadTimeline for the updated attribute
  //       const timeline = new LeadTimeline({
  //         lead: lead,
  //         attribute: attribute,
  //         value: updateLeadsDto[attribute],
  //       });

  //       // Save the LeadTimeline entity to the database
  //       await this.leadTimelineRepository.create(timeline);

  //       // Add the LeadTimeline entity to the timelines array of the lead
  //       lead.timelines.push(timeline);

  //       if (attribute === 'status' && updateLeadsDto.status === LeadsStatus.COMPLETED) {
  //         // Delete the lead
  //         await this.leadsRepository.findOneAndDelete({ id: lead.id });

  //         // Create a new customer with the properties from the lead, except for status
  //         const { status, timelines, ...leadProperties } = lead;
  //         const customer = new Customers({
  //           ...leadProperties,
  //         });
  //         const agent = await this.agentService.getOne(lead.agentId);

  //         // Save the new customer
  //         await this.customerService.create(customer, agent);

  //         for (const leadTimeline of lead.timelines) {
  //           leadTimeline.lead=null;
  //           const customerTimeline = new CustomerTimeline({
  //             ...leadTimeline,
  //             customer: customer, // Set the customer property to the new customer
  //           });

  //           // Save the CustomerTimeline entity to the database
  //           await this.customerTimelineRepository.create(customerTimeline);

  //           // No need to add the CustomerTimeline entity to the timelines array of the customer
  //         }

  //         // Save the updated customer
  //         await this.customerService.update(customer.id, customer);

  //         return customer;
  //       }
  //     }
  //   }

  //   // Save the updated lead
  //   await this.leadsRepository.findOneAndUpdate({where: {id: lead.id}},lead);

  //   // Create a new object that omits the lead property from each LeadTimeline in lead.timelines
  //   const leadToReturn = {
  //     ...lead,
  //     timelines: lead.timelines.map((timeline) => {
  //       const { lead, ...timelineWithoutLead } = timeline;
  //       return timelineWithoutLead;
  //     }),
  //   };

  //   return leadToReturn;
  // }
  async update(id: number, updateLeadsDto: UpdateLeadDto) {
    const lead = await this.leadsRepository.findOne({ id });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    // Use a map or object to track changes
    let hasChanges = false;
    const changes = {};

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
      'profilePicture',
    ];

    attributes.forEach((attribute) => {
      if (
        updateLeadsDto[attribute] !== undefined &&
        updateLeadsDto[attribute] !== lead[attribute]
      ) {
        changes[attribute] = updateLeadsDto[attribute];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      // Apply all changes in one go to the lead
      Object.assign(lead, changes);
      await this.leadsRepository.create(lead); // Assuming save() method can handle partial updates efficiently.

      // Create and save timeline records
      const timelines = Object.entries(changes).map(([attribute, value]) => {
        return {
          lead,
          attribute,
          value,
          // createdAt: new Date(),
        };
      });
      await Promise.all(timelines);
      if ('status' in changes && changes.status === LeadsStatus.COMPLETED) {
        await this.handleLeadConversion(lead); // Abstract the lead completion logic into a separate method.
        // This method would handle deletion of the lead, conversion to customer, etc.
      }
    }

    // Prepare and return the updated lead information
    const updatedLead = {
      ...lead,
      timelines: lead.timelines.map(({ lead, ...rest }) => rest),
    };
    return updatedLead;
  }
  private async handleLeadConversion(lead: Leads) {
    // Delete the lead
    await this.leadsRepository.findOneAndDelete({ id: lead.id });

    // Create a customer from the lead information
    const customer = await this.createCustomerFromLead(lead);

    // Update related timelines
    await this.updateTimelinesForCustomerConversion(lead, customer);

    return customer;
  }

  async createCustomerFromLead(lead: Leads): Promise<Customers> {
    const agent = await this.agentService.getOne(lead.agentId);

    const { status, timelines, ...leadProperties } = lead;
    const customer = new Customers({
      ...leadProperties,
    });

    return await this.customerService.create(customer, agent);
  }

  async updateTimelinesForCustomerConversion(lead: Leads, customer: Customers) {
    // Iterate over lead timelines and update them to associate with the customer
    for (const leadTimeline of lead.timelines) {
      // Omit the 'lead' property from LeadTimeline to create CustomerTimeline
      const { lead, ...timelineWithoutLead } = leadTimeline;

      // Create a new CustomerTimeline instance
      const customerTimeline = new CustomerTimeline({
        ...timelineWithoutLead, // Copy other properties from LeadTimeline
        customer, // Associate the timeline with the customer
      });

      // Save the CustomerTimeline entity to the database
      await this.customerTimelineRepository.create(customerTimeline);
    }
  }

  async delete(id: number) {
    return this.leadsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Leads>) {
    options.relations = ['product', 'service', 'timelines', 'segments']
    return this.leadsRepository.findAll(options);
  }

  async findAllWithSegmentId(options: ExtendedFindOptions<Leads>, id: number) {
    options.relations = ['product', 'service', 'timelines', 'segments'];
    options.where = {segments: {
      id:id
    }}
    return this.leadsRepository.findAll(options);
  }

  async findAllLeadsOfAgent(options: ExtendedFindOptions<Leads>) {
    return this.leadsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.leadsRepository.findOne({ id });
  }

  async updateProfilePicture(
    leadId: number,
    filePath: string,
  ): Promise<Leads> {
    // const organization = await this.organizationsRepository.findOne({id: organizationId});
    console.log('filePath', filePath);
    const organization = await this.leadsRepository.findOneAndUpdate(
      { where: { id: leadId } },
      { profilePicture: filePath },
    );
    return organization;
  }

  // async addDocuments(id: number, documents: string[]): Promise<Leads> {
  //   const lead = await this.leadsRepository.findOne({ id });
  //   lead.documents = [...lead.documents, ...documents];
  //   return this.leadsRepository.findOneAndUpdate({ where: { id } }, lead);
  // }

  // async updateDocument(
  //   id: number,
  //   filename: string,
  //   newFilePath: string,
  // ): Promise<Leads> {
  //   const lead = await this.leadsRepository.findOne({ id });
  //   const index = lead.documents.findIndex((doc) => doc.includes(filename));
  //   if (index !== -1) {
  //     const unlinkAsync = promisify(unlink);
  //     await unlinkAsync(lead.documents[index]); // delete the old file
  //     lead.documents[index] = newFilePath; // replace with the new file
  //   }
  //   return this.leadsRepository.findOneAndUpdate({ where: { id } }, lead);
  // }

  // async deleteDocument(id: number, filename: string): Promise<Leads> {
  //   const lead = await this.leadsRepository.findOne({ id });

  //   if (!lead) {
  //     throw new NotFoundException(`Agent with ID ${id} not found`);
  //   }

  //   const fullFilename = join('uploads', filename);
  //   const index = lead.documents.findIndex((doc) => doc === fullFilename);

  //   if (index !== -1) {
  //     const unlinkAsync = promisify(unlink);
  //     try {
  //       await unlinkAsync(fullFilename); // delete the file
  //     } catch (error) {
  //       throw new NotFoundException(`File ${filename} not found`);
  //     }

  //     lead.documents.splice(index, 1); // remove the file from the documents array

  //     await this.leadsRepository.create(lead); // save the updated agent
  //   }

  //   return lead;
  // }
}
