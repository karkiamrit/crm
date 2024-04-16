import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';


import { AgentsService } from '../agents.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateInvoiceDto })
  async create(
    @Body() createInvoicesDto: CreateInvoiceDto,
    @CurrentUser() user: User,
  ) {

    return await this.invoicesService.create(createInvoicesDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a invoice' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the invoice to update',
  })
  @ApiBody({ type: UpdateInvoiceDto })
  async update(@Param('id') id: number, @Body() updateInvoicesDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoicesDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a invoice' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the invoice to delete',
  })
  async delete(@Param('id') id: number) {
    return this.invoicesService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiBearerAuth()
  async findAll(@Query() query: any) {
    return this.invoicesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get an invoice by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the invoice' })
  async getOne(@Param('id') id: number) {
    return this.invoicesService.getOne(id);
  }

}
