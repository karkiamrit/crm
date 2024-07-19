import { Injectable, NotFoundException } from '@nestjs/common';
import { ExtendedFindOptions, User } from '@app/common';
import { Service } from './entities/services.entity';
import { ServicesRepository } from './services.repository';
import { LeadsService } from '../leads/leads.service';
import { Leads } from '../leads/entities/lead.entity';
import { Customers } from '../customers/entities/customer.entity';
import { CreateServiceDto } from './dtos/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    private readonly servicesRepository: ServicesRepository,
    private readonly leadsService: LeadsService,
  ) {}

  async create(
    createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    const {leadEmail,...rest} = createServiceDto;
    const lead = await this.leadsService.findOne( leadEmail );

    if (!lead) {
      throw new NotFoundException(`Lead with email ${createServiceDto.leadEmail} not found`);
    }

    const service = new Service({
      ...rest,
      lead,
    });

    return this.servicesRepository.create(service);
  }

  async findAll(
    options: ExtendedFindOptions<Service>,
  ): Promise<{ data: Service[]; total: number }> {
    const result = await this.servicesRepository.findAll(options);
    const data = result.data;
    const total = result.total;
    return { data, total };
  }

}
