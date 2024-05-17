import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { UpdateTransactionsDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionsService: TransactionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTransactionsDto })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.'})
  async create(@Body() createTransactionsDto: CreateTransactionsDto, @CurrentUser() user: User) {
    return await this.transactionsService.create(createTransactionsDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the transaction to update' })
  @ApiBody({ type: UpdateTransactionsDto })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully updated.'})
  async update(
    @Param('id') id: number,
    @Body() updateTransactionsDto: UpdateTransactionsDto,
  ) {
    return this.transactionsService.update(id, updateTransactionsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the transaction to delete' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully deleted.'})
  async delete(@Param('id') id: number) {
    return this.transactionsService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all transactions.'})
  async findAll(@Query() query: any){
    console.log("reached here")
    return this.transactionsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get a transaction by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the transaction' })
  @ApiResponse({ status: 200, description: 'Return the transaction.'})
  async getOne(@Param('id') id: number) {
    return this.transactionsService.getOne(id);
  }

}
