import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { AddCustomersToSegmentDto, AddLeadsToSegmentDto, UpdateSegmentDto } from './dto/update-segment.dto';
import { JwtAuthGuard, Roles, CurrentUser, User } from '@app/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@Controller('segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new segment' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateSegmentDto })
  async create(
    @Body() createSegmentDto: CreateSegmentDto,
    @CurrentUser() user: User,
  ) {
    return this.segmentsService.create(createSegmentDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get all segments' })
  @ApiBearerAuth()
  async findAll(@Query() query: any) {
    return this.segmentsService.findAll( query );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('User')
  @ApiOperation({ summary: 'Get a segment by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the segment',
  })
  async findOne(@Param('id') id: string) {
    return this.segmentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a segment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the segment to update',
  })
  @ApiBody({ type: UpdateSegmentDto })
  async update(
    @Param('id') id: string,
    @Body() updateSegmentDto: UpdateSegmentDto,
  ) {
    return this.segmentsService.update(+id, updateSegmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a segment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the segment to delete',
  })
  async remove(@Param('id') id: string) {
    return this.segmentsService.remove(+id);
  }

  @Post(':segmentId/addLead/:leadId')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Add a lead to an existing segment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'segmentId',
    required: true,
    description: 'The id of the segment',
  })
  @ApiParam({
    name: 'leadId',
    required: true,
    description: 'The id of the lead',
  })
  async addLeadToSegment(
    @Param('segmentId') segmentId: string,
    @Param('leadId') leadId: string,
  ) {
    return this.segmentsService.addLeadToSegment(+segmentId, +leadId);
  }

  @Post(':segmentId/addCustomer/:customerId')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async addCustomerToSegment(
    @Param('segmentId') segmentId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.segmentsService.addCustomerToSegment(+segmentId, +customerId);
  }

  @Put(':segmentId/addLeads')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  addLeadsToSegment(
    @Param('segmentId') segmentId: number,
    @Body() addLeadsToSegmentDto: AddLeadsToSegmentDto,
  ) {
    return this.segmentsService.addLeadsToSegment(segmentId, addLeadsToSegmentDto.leadIds);
  }

  @Put(':segmentId/addCustomers')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  addCustomersToSegment(
    @Param('segmentId') segmentId: number,
    @Body() addCustomersToSegmentDto: AddCustomersToSegmentDto,
  ) {
    return this.segmentsService.addCustomersToSegment(segmentId, addCustomersToSegmentDto.customerIds);
  }
}
