import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AgentsService } from '../agents.service';
import { Agent } from '../entities/agent.entity';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly agentService: AgentsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCustomerDto })
  @UseInterceptors(
    FileInterceptor('profile', {
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
    @Body() createCustomersDto: CreateCustomerDto,
    @CurrentUser() user: User,
    @Body() referenceNo?: any,
  ) {
    let agent: Agent;
    let profilePicture: any;
    if (file) {
      profilePicture = file.path;
    }
    const createCustomersDtoWithDocuments: CreateCustomerDto = {
      ...createCustomersDto,
      profilePicture,
    };
    if (!referenceNo.referenceNo) {
      agent = await this.agentService.getOne(user.id);
    } else {
      agent = await this.agentService.getOneByReferenceNo(
        referenceNo.referenceNo,
      );
      if (!agent) {
        throw new NotFoundException(
          `Agent with reference no ${referenceNo} not found`,
        );
      }
    }

    return await this.customersService.create(
      createCustomersDtoWithDocuments,
      agent,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the customer to update',
  })
  @ApiBody({ type: UpdateCustomerDto })
  async update(
    @Param('id') id: number,
    @Body() updateCustomersDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomersDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the customer to delete',
  })
  async delete(@Param('id') id: number) {
    return this.customersService.delete(id);
  }

  @Get('mycustomers')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiBearerAuth()
  async findCustomersOfCurrentAgent(
    @Query() query: any,
    @CurrentUser() user: User,
  ) {
    const agent = await this.agentService.getAgentByUserId(user.id);
    if (agent) {
      query.agentId = agent.id;
    }
    return this.customersService.findAllCustomersOfAgent(query);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiBearerAuth()
  async findAll(@Query() query: any) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get an customer by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the customer',
  })
  async getOne(@Param('id') id: number) {
    return this.customersService.getOne(id);
  }

  // @Patch(':id/upload-documents')
  // @UseGuards(JwtAuthGuard)
  // @Roles('Customer')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Upload customer documents' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The documents have been successfully uploaded.',
  // })
  // @UseInterceptors(
  //   FilesInterceptor('documents', 10, {
  //     storage: diskStorage({
  //       destination: './uploads', // specify the path where the files should be saved
  //       filename: (req, file, callback) => {
  //         const name = Date.now() + extname(file.originalname); // generate a unique filename
  //         callback(null, name);
  //       },
  //     }),
  //   }),
  // )
  // async addDocuments(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Param('id') id: number,
  // ): Promise<Customers> {
  //   const documents = files.map((file) => file.path);
  //   return this.customersService.addDocuments(id, documents);
  // }

  // @Patch(':id/update-document/:filename')
  // @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Update a document of an customer' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The document has been successfully updated.',
  // })
  // @UseInterceptors(
  //   FileInterceptor('document', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         callback(null, req.params.filename); // use the existing filename
  //       },
  //     }),
  //   }),
  // )
  // async updateDocument(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('id') id: number,
  //   @Param('filename') filename: string,
  // ): Promise<Customers> {
  //   return this.customersService.updateDocument(id, filename, file.path);
  // }

  // @Delete(':id/delete-document/:filename')
  // @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Delete a document of an customer' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The document has been successfully deleted.',
  // })
  // async deleteDocument(
  //   @Param('id') id: number,
  //   @Param('filename') filename: string,
  // ): Promise<Customers> {
  //   return this.customersService.deleteDocument(id, filename);
  // }
}
