import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { UpdateTransactionsDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Transaction } from './entities/transaction.entity';
import { TransactionGuard } from './guards/transaction.guard';

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
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Only accept images
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          // Reject file
          return callback(new Error('Only image files are allowed!'), false);
        }
        // Accept file
        callback(null, true);
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateTransactionsDto,
    @CurrentUser() user: User
  ) {
    let logo: any;
    if (file) {
      logo = file.path;
    }
    return await this.transactionsService.create(createDto, user, logo);
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

  @Put(':id/update-profile-picture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload lead picture' })
  @ApiResponse({
    status: 200,
    description: 'The picture has been successfully uploaded.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
    }),
  )
  async updateLogo(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Param('filename') filename: string,
  ): Promise<Transaction> {
    return this.transactionsService.updateLogo(id, file.path);
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

  @Get('user/:id')
  @UseGuards(TransactionGuard)
  @ApiOperation({ summary: 'Get a transaction by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the transaction' })
  @ApiResponse({ status: 200, description: 'Return the transaction.'})
  async getOneByUser(@Param('id') id: number) {
    return this.transactionsService.getOne(id);
  }

  @Get('generate-transaction-url/:transactionId')
  async generateTransactionUrl(@Param('transactionId') transactionId: number) {
    return await this.transactionsService.generateUploadUrl(transactionId);
  }

}
