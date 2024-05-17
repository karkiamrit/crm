import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingsDto } from './dto/create-listing.dto';
import { UpdateListingsDto } from './dto/update-listing.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';

@Controller('transactionTask')
export class ListingController {
  constructor(private readonly transactionTasksService: ListingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new transactionTask' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateListingsDto })
  @ApiResponse({ status: 201, description: 'The transactionTask has been successfully created.'})
  async create(@Body() createListingsDto: CreateListingsDto) {
    return await this.transactionTasksService.create(createListingsDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a transactionTask' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the transactionTask to update' })
  @ApiBody({ type: UpdateListingsDto })
  @ApiResponse({ status: 200, description: 'The transactionTask has been successfully updated.'})
  async update(
    @Param('id') id: number,
    @Body() updateListingsDto: UpdateListingsDto,
  ) {
    return this.transactionTasksService.update(id, updateListingsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a transactionTask' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the transactionTask to delete' })
  @ApiResponse({ status: 200, description: 'The transactionTask has been successfully deleted.'})
  async delete(@Param('id') id: number) {
    return this.transactionTasksService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get all transactionTasks' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all transactionTasks.'})
  async findAll(@Query() query: any){
    return this.transactionTasksService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get a transactionTask by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the transactionTask' })
  @ApiResponse({ status: 200, description: 'Return the transactionTask.'})
  async getOne(@Param('id') id: number) {
    return this.transactionTasksService.getOne(id);
  }

}
