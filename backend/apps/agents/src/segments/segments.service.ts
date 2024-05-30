import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import {
  AddLeadsToSegmentDto,
  UpdateSegmentDto,
} from './dto/update-segment.dto';
import { ExtendedFindOptions, User } from '@app/common';
import { Segment } from './entities/segment.entity';
import { SegmentsRepository } from './segments.repository';
import { LeadsService } from '../leads/leads.service';
import { Leads } from '../leads/entities/lead.entity';
import { Customers } from '../customers/entities/customer.entity';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class SegmentsService {
  constructor(
    private readonly segmentsRepository: SegmentsRepository,
    private readonly leadsService: LeadsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(
    createSegmentDto: CreateSegmentDto,
    user: User,
  ): Promise<Segment> {
    let leads: Leads[] = [];
    let customers: Customers[] = [];
    let segment: Segment;
    if (
      await this.segmentsRepository.findOne({ name: createSegmentDto.name })
    ) {
      throw new NotFoundException(
        `Segment with name ${createSegmentDto.name} already exists`,
      );
    }
    if (createSegmentDto.leads) {
      leads = createSegmentDto.leads
        ? await Promise.all(
            createSegmentDto.leads.map((id) => this.leadsService.getOne(id)),
          )
        : [];
      segment = new Segment({
        ...createSegmentDto,
        leads,
        customers,
        userId: user.id,
      });
    }
    if (createSegmentDto.customers) {
      customers = createSegmentDto.customers
        ? await Promise.all(
            createSegmentDto.customers.map((id) =>
              this.customersService.getOne(id),
            ),
          )
        : [];
      segment = new Segment({
        ...createSegmentDto,
        leads,
        customers,
        userId: user.id,
      });
    } else {
      segment = new Segment({
        ...createSegmentDto,
        leads,
        customers,
        userId: user.id,
      });
    }
    return this.segmentsRepository.create(segment);
  }

  async findAll(
    options: ExtendedFindOptions<Segment>,
  ): Promise<{ data: Segment[]; total: number }> {
    options.relations = ['leads'];
    const result = await this.segmentsRepository.findAll(options);
    const data = result.data;
    const total = result.total;
    return { data, total };
  }

  async findOne(id: number, relations?: string[]): Promise<Segment> {
    if (!relations) {
      relations = [];
    }
    const segment = await this.segmentsRepository.findOne({ id }, relations);

    if (!segment) {
      throw new NotFoundException(`Segment with ID ${id} not found`);
    }
    return segment;
  }

  async update(
    id: number,
    updateSegmentDto: UpdateSegmentDto,
  ): Promise<Segment> {
    const segment = await this.findOne(id);
    if (updateSegmentDto.name !== undefined) {
      segment.name = updateSegmentDto.name;
    }

    if (updateSegmentDto.description !== undefined) {
      segment.description = updateSegmentDto.description;
    }

    return this.segmentsRepository.findOneAndUpdate(
      { where: { id: id } },
      segment,
    );
  }

  async remove(id: number): Promise<void> {
    const segment = await this.findOne(id);
    if (!segment) {
      throw new NotFoundException(`Segment with ID ${id} not found`);
    }
    await this.segmentsRepository.findOneAndDelete({ id });
  }

  async addLeadToSegment(segmentId: number, leadId: number): Promise<Segment> {
    const segment = await this.segmentsRepository.findOne({ id: segmentId });
    const lead = await this.leadsService.getOne(leadId);

    if (!segment || !lead) {
      throw new NotFoundException('Segment or Lead not found');
    }

    segment.leads.push(lead);

    return this.segmentsRepository.findOneAndUpdate(
      { where: { id: segment.id } },
      segment,
    );
  }

  async addCustomerToSegment(
    segmentId: number,
    customerId: number,
  ): Promise<Segment> {
    const segment = await this.segmentsRepository.findOne({ id: segmentId });
    const customer = await this.leadsService.getOne(customerId);

    if (!segment || !customer) {
      throw new NotFoundException('Segment or Lead not found');
    }

    segment.leads.push(customer);

    return this.segmentsRepository.findOneAndUpdate(
      { where: { id: segment.id } },
      segment,
    );
  }

  async addLeadsToSegment(
    segmentId: number,
    leadIds: number[],
  ): Promise<Segment> {
    const segment = await this.segmentsRepository.findOne({ id: segmentId }, [
      'leads',
    ]);
    if (!segment) {
      throw new NotFoundException('Segment not found');
    }

    const leads = await Promise.all(
      leadIds.map((id) => this.leadsService.getOne(id)),
    );
    if (leads.some((lead) => !lead)) {
      throw new NotFoundException('One or more leads not found');
    }

    if (!Array.isArray(segment.leads)) {
      segment.leads = [segment.leads];
    }
    segment.leads.push(...leads);
    return this.segmentsRepository.findOneAndUpdate(
      { where: { id: segment.id } },
      segment,
    );
  }

  async removeLeadFromSegment(
    segmentId: number,
    leadId: number,
  ): Promise<void> {
    const segment = await this.segmentsRepository.findOne({ id: segmentId }, [
      'leads',
    ]);
    segment.leads = segment.leads.filter((lead) => lead.id !== Number(leadId));
    await this.segmentsRepository.findOneAndUpdate(
      { where: { id: segment.id } },
      segment,
    );
  }

  async removeCustomerFromSegment(
    segmentId: number,
    customerId: number,
  ): Promise<void> {
    const segment = await this.segmentsRepository.findOne({ id: segmentId }, [
      'customers',
    ]);
    segment.customers = segment.customers.filter(
      (customer) => customer.id !== Number(customerId),
    );
    await this.segmentsRepository.findOneAndUpdate(
      { where: { id: segment.id } },
      segment,
    );
  }

  async addCustomersToSegment(
    segmentId: number,
    customerIds: number[],
  ): Promise<Segment> {
    const segment = await this.segmentsRepository.findOne({ id: segmentId }, [
      'customers',
    ]);
    if (!segment) {
      throw new NotFoundException('Segment not found');
    }

    const customers = await Promise.all(
      customerIds.map((id) => this.leadsService.getOne(id)),
    );
    if (customers.some((lead) => !lead)) {
      throw new NotFoundException('One or more leads not found');
    }

    if (!Array.isArray(segment.customers)) {
      segment.customers = [segment.customers];
    }
    segment.leads.push(...customers);
    return this.segmentsRepository.findOneAndUpdate(
      { where: { id: segment.id } },
      segment,
    );
  }
}
