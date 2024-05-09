import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customers } from './entities/customer.entity';
import { CustomersRepository } from './customers.repository';
import { ExtendedFindOptions, User } from '@app/common';
import { promisify } from 'util';
import { unlink } from 'fs';

import { AgentsService } from '../agents.service';
import { join } from 'path';
import { Agent } from '../entities/agent.entity';
import { Service } from '../shared/objects/services/services.entity';
import { CustomerTimeline } from '../shared/objects/timelines/timelines.entity';
import { Product } from '../shared/objects/products/products.entity';
import { CustomerTimelineRepository } from '../shared/objects/timelines/customers.timelines.repository';


@Injectable()
export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly customerTimelineRepository: CustomerTimelineRepository,
    private readonly agentService: AgentsService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, agent?: Agent) {
    // Convert CreateTimelineInputDTO[] to CustomerTimeline[]
    let product: Product, service: Service, timelines: CustomerTimeline[];
    // Convert CreateProductInputDTO to Product
    if (createCustomerDto.product) {
      product = new Product(createCustomerDto.product);
    }
    if (createCustomerDto.service) {
      service = new Service(createCustomerDto.service);
    }
    // Create a new Customers entity
    const customer = new Customers({
      ...createCustomerDto,
      service,
      product,
    });
    if(agent){
      customer.agentId = agent.id;
    }

    await this.customersRepository.create(customer);

    return customer;
  }


  async createMany(createCustomerDtos: CreateCustomerDto[]) {
    const customers = createCustomerDtos.map((dto) => {
      let product: Product, service: Service;
      if (dto.product) {
        product = new Product(dto.product);
      }
      if (dto.service) {
        service = new Service(dto.service);
      }
      const {revenuePotential,...rest} = dto;
      let updatedRevenuePotential = Number(dto.revenuePotential)
      return new Customers({
        ...rest,
        service,
        product
      });
    });
    return await this.customersRepository.createMany(customers);
  }

  async update(id: number, updateCustomersDto: UpdateCustomerDto) {
    // Find the customer
    const customer = await this.customersRepository.findOne({ id });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
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
        updateCustomersDto[attribute] &&
        updateCustomersDto[attribute] !== customer[attribute]
      ) {
        // Update the attribute
        customer[attribute] = updateCustomersDto[attribute];

        // Create a new CustomerTimeline for the updated attribute
        const timeline = new CustomerTimeline({
          customer: customer,
          attribute: attribute,
          value: updateCustomersDto[attribute],
        });

        // Save the CustomerTimeline entity to the database
        await this.customerTimelineRepository.create(timeline);

        // Add the CustomerTimeline entity to the timelines array of the customer
        customer.timelines.push(timeline);
      }
    }

    // Save the updated customer
    await this.customersRepository.create(customer);

    // Create a new object that omits the customer property from each CustomerTimeline in customer.timelines
    const customerToReturn = {
      ...customer,
      timelines: customer.timelines.map((timeline) => {
        const { customer, ...timelineWithoutCustomer } = timeline;
        return timelineWithoutCustomer;
      }),
    };

    return customerToReturn;
  }

  async delete(id: number) {
    return this.customersRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Customers>) {
    options.relations = ['product', 'service', 'timelines', 'segments'];
    return this.customersRepository.findAll(options);
  }

  async findAllCustomersOfAgent(
    options: ExtendedFindOptions<Customers>,
  ){
    return this.customersRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.customersRepository.findOne({ id });
  }
  
  async updateProfilePicture(leadId: number, filePath: string): Promise<Customers> {
    const customer = await this.customersRepository.findOneAndUpdate(
      { where: { id: leadId } },
      { profilePicture: filePath },
    );
    if(!customer){
      throw new NotFoundException(`Customer with ID ${leadId} not found`);
    }
    return customer;
  }

  // async addDocuments(id: number, documents: string[]): Promise<Customers> {
  //   const customer = await this.customersRepository.findOne({ id });
  //   customer.documents = [...customer.documents, ...documents];
  //   return this.customersRepository.findOneAndUpdate({ where: { id } }, customer);
  // }

  // async updateDocument(
  //   id: number,
  //   filename: string,
  //   newFilePath: string,
  // ): Promise<Customers> {
  //   const customer = await this.customersRepository.findOne({ id });
  //   const index = customer.documents.findIndex((doc) => doc.includes(filename));
  //   if (index !== -1) {
  //     const unlinkAsync = promisify(unlink);
  //     await unlinkAsync(customer.documents[index]); // delete the old file
  //     customer.documents[index] = newFilePath; // replace with the new file
  //   }
  //   return this.customersRepository.findOneAndUpdate({ where: { id } }, customer);
  // }

  // async deleteDocument(id: number, filename: string): Promise<Customers> {
  //   const customer = await this.customersRepository.findOne({ id });

  //   if (!customer) {
  //     throw new NotFoundException(`Agent with ID ${id} not found`);
  //   }

  //   const fullFilename = join('uploads', filename);
  //   const index = customer.documents.findIndex((doc) => doc === fullFilename);

  //   if (index !== -1) {
  //     const unlinkAsync = promisify(unlink);
  //     try {
  //       await unlinkAsync(fullFilename); // delete the file
  //     } catch (error) {
  //       throw new NotFoundException(`File ${filename} not found`);
  //     }

  //     customer.documents.splice(index, 1); // remove the file from the documents array

  //     await this.customersRepository.create(customer); // save the updated agent
  //   }

  //   return customer;
  // }
}
