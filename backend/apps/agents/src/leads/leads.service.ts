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
import { CustomerTimelineRepository } from '../shared/objects/timelines/customers.timelines.repository';
import { Customers } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';
import { LeadsStatus } from '../shared/data';
import { LeadTimelineRepository } from '../shared/objects/timelines/leads.timelines.repository';
import { SegmentsRepository } from '../segments/segments.repository';
import { Segment } from '../segments/entities/segment.entity';

@Injectable()
export class LeadsService {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly agentService: AgentsService,
    private readonly customerTimelineRepository: CustomerTimelineRepository,
    private readonly customerService: CustomersService,
    private readonly leadsTimelineRepository: LeadTimelineRepository,

    private readonly segmentsRepository: SegmentsRepository,
  ) {}

  async create(createLeadDto: CreateLeadDto, user?: User, agent?: Agent) {
    let newSegment: number | null;
    if (createLeadDto.segment === '' || undefined) {
      newSegment = null;
    } else {
      newSegment = Number(createLeadDto.segment);
    }
    const { revenuePotential, ...rest } = createLeadDto;
    // Convert CreateTimelineInputDTO[] to LeadTimeline[]
    let product: Product, service: Service;
    // Convert CreateProductInputDTO to Product
    if (createLeadDto.product) {
      product = new Product(createLeadDto.product);
    }
    if (createLeadDto.service) {
      service = new Service(createLeadDto.service);
    }
    let updatedRevenuePotential = Number(createLeadDto.revenuePotential);
    // Create a new Leads entity
    const lead = new Leads({
      ...rest,
      service,
      product,
      revenuePotential: updatedRevenuePotential,
    });
    if (agent) {
      lead.agentId = agent.id;
    }
    lead.updatedTime= new Date();

    let createdLead = await this.leadsRepository.create(lead);
    console.log(newSegment);
    if (createdLead && newSegment !== null) {
      const segment = this.addLeadToSegment(newSegment, createdLead.id);
      if (!segment) {
        throw new NotFoundException(
          `Lead Created But Segment couldnt be created`,
        );
      }
    }
    return createdLead;
  }

  async createMany(createLeadDtos: CreateLeadDto[]) {
    const leads = createLeadDtos.map((dto) => {
      let product: Product, service: Service;
      if (dto.product) {
        product = new Product(dto.product);
      }
      if (dto.service) {
        service = new Service(dto.service);
      }
      const { revenuePotential, ...rest } = dto;
      let updatedRevenuePotential = Number(dto.revenuePotential);
      return new Leads({
        ...rest,
        service,
        product,
        revenuePotential: updatedRevenuePotential,
      });
    });
    return await this.leadsRepository.createMany(leads);
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
  async update(id: number, updateLeadsDto: UpdateLeadDto, user: User) {
    const lead = await this.leadsRepository.findOne({ id });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    // Use a map or object to track changes
    let hasChanges = false;
    const changes = {};

    const attributes = [
      'address',
      'details',
      'status',
      'phone',
      'email',
      'name',
      'revenuePotential',
    ];
    lead.updatedTime = new Date();
    attributes.forEach((attribute) => {
      if (
        updateLeadsDto[attribute] !== undefined &&
        updateLeadsDto[attribute] !== lead[attribute]
      ) {
        changes[attribute] = updateLeadsDto[attribute];
        hasChanges = true;
      }
    });
    // await this.update(lead.id, {updatedTime: new Date()});

    if (hasChanges) {
      // Apply all changes in one go to the lead
      
      await this.leadsRepository.create(lead); 
      // Create and save timeline records
      const timelines = Object.entries(changes).map(async([attribute, value]) => {
        const timeline = new LeadTimeline({
          lead,
          attribute,
          value: value as string, // Cast the value to string
          previousValue: lead[attribute] as string, // Cast the previous value to string,
          createdBy: user.email
        });
        const createdTimeline= await this.leadsTimelineRepository.create(timeline); // Save the timeline to the database
        return createdTimeline;
      });
      Object.assign(lead, changes);
      await Promise.all(timelines);
      if ('status' in changes && changes.status === LeadsStatus.PAST_CLIENT) {
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
    // Create a customer from the lead information
    await this.leadsRepository.findOneAndDelete({ id: lead.id });
    const customer = await this.createCustomerFromLead(lead);
    // Update related timelines
    await this.updateTimelinesForCustomerConversion(lead, customer);
    return customer;
  }

  async createCustomerFromLead(lead: Leads): Promise<Customers> {
    let agent: Agent | null;
    agent = await this.agentService.getOne(lead.agentId);

    const { status, timelines, ...leadProperties } = lead;
    const customer = new Customers({
      ...leadProperties,
    });
    if (agent) {
      customer.agentId = agent.id;
    }
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
    options.relations = ['segments','tasks'];
    const leads = await this.leadsRepository.findAll(options);
    return leads;
  }

  async findAllWithSegmentId(options: ExtendedFindOptions<Leads>, id: number) {
    options.relations = ['product', 'segments'];
    options.where = {
      segments: {
        id: id,
      },
    };
    return this.leadsRepository.findAll(options);
  }

  async findAllLeadsOfAgent(options: ExtendedFindOptions<Leads>) {
    return await this.leadsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.leadsRepository.findOne({ id });
  }

  async findOne(email: string) {
    return this.leadsRepository.findOne({ email: email });
  }

  async updateProfilePicture(leadId: number, filePath: string): Promise<Leads> {
    // const organization = await this.organizationsRepository.findOne({id: organizationId});
    console.log('filePath', filePath);
    const leads = await this.leadsRepository.findOneAndUpdate(
      { where: { id: leadId } },
      { profilePicture: filePath },
    );
    return leads;
  }

  async leadsTimeline(id: number) {
    return this.leadsTimelineRepository.findAll({
      where: {
        lead: {
          id,
        },
      },
      skip: 0,
      take:10,
      order: {
        createdAt: 'DESC',
      },
      relations: ['lead'],
    });
  }

  async customersTimeline(id: number) {
    return this.customerTimelineRepository.findAll({
      where: {
        customer: {
          id,
        },
      },
      relations: ['customer'],
    });
  }

  async addLeadToSegment(segmentId: number, leadId: number): Promise<Segment> {
    if (segmentId && segmentId === undefined) {
      throw new Error('Segment ID cant be undefined');
    }
    const segment = await this.segmentsRepository.findOne({ id: segmentId });

    const lead = await this.getOne(leadId);

    if (!segment || !lead) {
      throw new NotFoundException('Segment or Lead not found');
    }

    // Check if segment.leads is defined, if not, initialize it as an empty array
    if (!segment.leads) {
      segment.leads = [];
    }

    segment.leads.push(lead);

    const updatedSegment = await this.segmentsRepository.findOneAndUpdate(
      { where: { id: segment.id } },
      segment,
    );
    return updatedSegment;
  }

  // async updateTime(id: number): Promise<Leads> {
  //   const lead = await this.leadsRepository.findOne({ id });
  //   lead.updatedTime = new Date();
  //   return await this.leadsRepository.findOneAndUpdate({ where: { id } }, lead);
  // }

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
