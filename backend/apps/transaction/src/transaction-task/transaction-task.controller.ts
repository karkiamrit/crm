import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TransactionTaskService } from './transaction-task.service';
import { CreateTransactionTaskDto } from './dto/create-transaction-task.dto';
import { UpdateTransactionTaskDto } from './dto/update-transaction-task.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('transactionTask')
export class TransactionTaskController {
  constructor(private readonly transactionTasksService: TransactionTaskService) {}

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // @Roles('Agent')
  // @ApiOperation({ summary: 'Create a new transactionTask' })
  // @ApiBearerAuth()
  // @ApiBody({ type: CreateTransactionTaskDto })
  // @ApiResponse({ status: 201, description: 'The transactionTask has been successfully created.'})
  // async create(@Body() createTransactionTasksDto: CreateTransactionTaskDto) {
  //   return await this.transactionTasksService.create(createTransactionTasksDto);
  // }

  @Post()
@UseGuards(JwtAuthGuard)
@Roles('Agent')
@ApiOperation({ summary: 'Create a new transactionTask' })
@ApiBearerAuth()
@ApiBody({ type: CreateTransactionTaskDto })
@ApiResponse({ status: 201, description: 'The transactionTask has been successfully created.'})
@UseInterceptors(
  FileInterceptor('templateDocument', {
    storage: diskStorage({
      destination: './uploads', // specify the path where the files should be saved
      filename: (req, file, callback) => {
        const name = Date.now() + extname(file.originalname); // generate a unique filename
        callback(null, name);
      },
    }),
    fileFilter: (req, file, callback) => {
      // Only accept documents
      if (!file.originalname.match(/\.(doc|docx|pdf|csv|xlxs|jpeg)$/)) {
        // Reject file
        return callback(new Error('Only document files are allowed!'), false);
      }
      // Accept file
      callback(null, true);
    },
  }),
)
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() createTransactionTasksDto: CreateTransactionTaskDto,
) {
  let templateDocument: any;
  if (file) {
    templateDocument = file.path;
  }
  const createTransactionTasksDtoSeperated: CreateTransactionTaskDto = {
    ...createTransactionTasksDto,
    templateDocument,
  };
  createTransactionTasksDtoSeperated.customerId = Number(createTransactionTasksDto.customerId);
  createTransactionTasksDtoSeperated.transactionId = Number(createTransactionTasksDto.transactionId);

  return await this.transactionTasksService.create(createTransactionTasksDtoSeperated);
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
