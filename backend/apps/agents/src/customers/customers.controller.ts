import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, CustomerImportDto } from './dto/create-customer.dto';
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
import { Customers } from './entities/customer.entity';
import { Workbook } from 'exceljs';
import { Segment } from '../segments/entities/segment.entity';
import { SegmentsRepository } from '../segments/segments.repository';
import { Response } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly agentService: AgentsService,
    private readonly segmentsRepository: SegmentsRepository
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
    if(await this.customersService.findOne(createCustomersDto.email)){
      throw new InternalServerErrorException('Lead with email already exists');
    }
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
  async updateProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Param('filename') filename: string,
  ): Promise<Customers> {
    return this.customersService.updateProfilePicture(id, file.path);
  }

  @Get('export/csv')
  async export(@Query() filter: any, @Res() res: Response) {
    const customers = await this.customersService.findAll(filter);

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Customers');

    // Define columns in the worksheet
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Address', key: 'address', width: 32 },
      { header: 'Details', key: 'details', width: 32 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Priority', key: 'priority', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Source', key: 'source', width: 15 },
      // { header: 'Documents', key: 'documents', width: 15 },
      // { header: 'Agent Id', key: 'agentId', width: 10 },
      // { header: 'Product Id', key: 'productId', width: 10 },
      // { header: 'Service Id', key: 'serviceId', width: 10 },
      // { header: 'Segments', key: 'segments', width: 30 },
    ];

    // Add rows to the worksheet
    customers.data.forEach((customer: Customers) => {
      const customerWithSegmentsString = {
        ...customer,
        // segments: customer.segments.map((segment) => segment.name).join(', '),
      };
      worksheet.addRow(customerWithSegmentsString);

      worksheet.addRow(customer);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'leads.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  @Post('import/csv')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname);
          callback(null, name);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(new Error('Only CSV files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async import(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Body() leadImportDto: CustomerImportDto,
    @CurrentUser() user: User,
  ) {
    const agent = await this.agentService.getAgentByUserId(user.id);

    // If bucketId is provided, find the corresponding bucket
    let segment: Segment;
    if (leadImportDto.segmentId) {
      segment = await this.segmentsRepository.findOne({
        id: leadImportDto.segmentId,
      });
    }
    const workbook = new Workbook();

    await workbook.csv.readFile(file.path);

    const worksheet = workbook.getWorksheet(1);
    const requiredHeaders = ['phone', 'email', 'name'].map(
      this.normalizeHeader,
    );
    const optionalHeaders = [
      'address',
      'details',
      'type',
      'source',
    ].map(this.normalizeHeader);
    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new NotFoundException(
        `Missing required headers: ${missingHeaders.join(', ')}`,
      );
    }
    const customers = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const customer = {};
      [
        'address',
        'details',
        'type',
        'phone',
        'email',
        'name',
        'source',
      ].forEach((header) => {
        const index = headers.indexOf(header);
        if (index !== -1) {
          customer[header] = row.getCell(index + 1).value;
        }
      });
      if (agent) {
        customer['agent'] = agent;
      }
      // If bucket is found, associate it with the lead
      if (segment) {
        customer['bucket'] = segment;
      }
      customers.push(customer);
    });
    try {
      const createdCustomers = await this.customersService.createMany(customers);
      res.status(201).json(createdCustomers);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating customers');
    }
  }
  private normalizeHeader(header: string): string {
    return header.toLowerCase().trim();
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
