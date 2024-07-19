import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Service } from './entities/services.entity';
import { CreateServiceDto } from './dtos/create-service.dto';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({ status: 201, type: Service })
  async create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiQuery({ name: 'query', required: false })
  @ApiResponse({ status: 200, type: [Service] })
  async findAll(@Query() query: any) {
    return this.servicesService.findAll(query);
  }
}