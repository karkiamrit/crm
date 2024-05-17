import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { TransactionTaskService } from './transaction-task.service';
import { CreateTransactionTaskDto } from './dto/create-transaction-task.dto';
import { UpdateTransactionTaskDto } from './dto/update-transaction-task.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';

@Controller('transactionTask')
export class TransactionTaskController {
  constructor(private readonly transactionTasksService: TransactionTaskService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new transactionTask' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTransactionTaskDto })
  @ApiResponse({ status: 201, description: 'The transactionTask has been successfully created.'})
  async create(@Body() createTransactionTasksDto: CreateTransactionTaskDto) {
    return await this.transactionTasksService.create(createTransactionTasksDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a transactionTask' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the transactionTask to update' })
  @ApiBody({ type: UpdateTransactionTaskDto })
  @ApiResponse({ status: 200, description: 'The transactionTask has been successfully updated.'})
  async update(
    @Param('id') id: number,
    @Body() updateTransactionTasksDto: UpdateTransactionTaskDto,
  ) {
    return this.transactionTasksService.update(id, updateTransactionTasksDto);
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
