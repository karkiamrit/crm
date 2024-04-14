import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { ExtendedFindOptions, User } from '@app/common';
import { Segment } from './entities/segment.entity';
import { SegmentsRepository } from './segments.repository';
import { LeadsService } from '../leads/leads.service';

@Injectable()
export class SegmentsService {
  constructor(
    private readonly segmentsRepository: SegmentsRepository,
    private readonly leadsService: LeadsService,
  ) {}

  async create(
    createSegmentDto: CreateSegmentDto,
    user: User,
  ): Promise<Segment> {
    const leads = createSegmentDto.leads
    ? await Promise.all(createSegmentDto.leads.map((id) => this.leadsService.getOne(id)))
    : [];
    const segment = new Segment({
      ...createSegmentDto,
      leads,
      userId: user.id,
    });

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

  async findOne(id: number): Promise<Segment> {
    const segment = await this.segmentsRepository.findOne({ id });
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
}
