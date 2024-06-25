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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Workbook } from 'exceljs';
import { Response } from 'express';

import { LeadsService } from './leads.service';
import { CreateLeadDto, LeadImportDto } from './dto/create-lead.dto';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Leads } from './entities/lead.entity';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AgentsService } from '../agents.service';
import { Agent } from '../entities/agent.entity';
import { SegmentsRepository } from '../segments/segments.repository';
import { Segment } from '../segments/entities/segment.entity';
import { EventPattern } from '@nestjs/microservices';

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly agentService: AgentsService,
    private readonly segmentsRepository: SegmentsRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateLeadDto })
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
    @Body() createLeadsDto: CreateLeadDto,
    @CurrentUser() user: User,
    @Body() referenceNo?: any,
  ) {

    let agent: Agent;

    let profilePicture: any;
    if (file) {
      profilePicture = file.path;
    }
    const createLeadsDtoSeperated: CreateLeadDto = {
      ...createLeadsDto,
      profilePicture,
    };

    if(await this.leadsService.findOne(createLeadsDto.email)){
      throw new InternalServerErrorException('Lead with email already exists');
    }
    const { ...createLeadsDtoWithDocuments } = createLeadsDtoSeperated;
    if (
      referenceNo.referenceNo === '' ||
      referenceNo.referenceNo === null ||
      referenceNo.referenceNo === undefined
    ) {
      return await this.leadsService.create(createLeadsDtoWithDocuments, user);
    } else {
      agent = await this.agentService.getOneByReferenceNo(
        referenceNo.referenceNo,
      );
      if (!agent) {
        throw new NotFoundException(
          `Agent with reference no ${referenceNo.referenceNo} not found`,
        );
      }
    }
    return await this.leadsService.create(
      createLeadsDtoWithDocuments,
      user,
      agent,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a lead' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the lead to update',
  })
  @ApiBody({ type: UpdateLeadDto })
  async update(@Param('id') id: number, @Body() updateLeadsDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a lead' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the lead to delete',
  })
  async delete(@Param('id') id: number) {
    return this.leadsService.delete(id);
  }

  @Get('myleads')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get all leads' })
  @ApiBearerAuth()
  async findLeadsOfCurrentAgent(
    @Query() query: any,
    @CurrentUser() user: User,
  ) {
    const agent = await this.agentService.getAgentByUserId(user.id);
    if (agent) {
      query.agentId = agent.id;
    }
    return this.leadsService.findAllLeadsOfAgent(query);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  @ApiOperation({ summary: 'Get all leads' })
  @ApiBearerAuth()
  async findAll(@Query() query: any) {
    return this.leadsService.findAll(query);
  }

  @Get('segment/:id')
  // @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get all leads' })
  @ApiBearerAuth()
  async findAllBySegmentId(@Param('id') id: number, @Query() query: any) {
    return this.leadsService.findAllWithSegmentId(query, id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get an lead by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the lead' })
  async getOne(@Param('id') id: number) {
    return this.leadsService.getOne(id);
  }

  // @Patch(':id/upload-documents')
  // @UseGuards(JwtAuthGuard)
  // @Roles('Lead')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Upload lead documents' })
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
  // ): Promise<Leads> {
  //   const documents = files.map((file) => file.path);
  //   return this.leadsService.addDocuments(id, documents);
  // }

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
  ): Promise<Leads> {
    return this.leadsService.updateProfilePicture(id, file.path);
  }

  @Get('leadtimeline/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get lead timeline' })
  @ApiBearerAuth()
  async getLeadTimeline(@Param('id') id: number) {
    return this.leadsService.leadsTimeline(id);
  }

  @Get('customertimeline/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Get lead timeline' })
  @ApiBearerAuth()
  async getCustomerTimeline(@Param('id') id: number) {
    return this.leadsService.customersTimeline(id);
  }

  // @Delete(':id/delete-document/:filename')
  // @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Delete a document of an lead' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The document has been successfully deleted.',
  // })
  // async deleteDocument(
  //   @Param('id') id: number,
  //   @Param('filename') filename: string,
  // ): Promise<Leads> {
  //   return this.leadsService.deleteDocument(id, filename);
  // }

  @Get('export/csv')
  async export(@Query() filter: any, @Res() res: Response) {
    const leads = await this.leadsService.findAll(filter);

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Leads');
    console.log(filter)
    // Define columns in the worksheet
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Address', key: 'address', width: 32 },
      { header: 'Details', key: 'details', width: 32 },
      { header: 'Status', key: 'status', width: 35 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Revenue Potential', key: 'revenuePotential', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Source', key: 'source', width: 15 },
      // { header: 'Documents', key: 'documents', width: 15 },
      // { header: 'Agent Id', key: 'agentId', width: 10 },
      // { header: 'Product Id', key: 'productId', width: 10 },
      // { header: 'Service Id', key: 'serviceId', width: 10 },
      // { header: 'Segments', key: 'segments', width: 30 },
    ];

    // Add rows to the worksheet
    leads.data.forEach((lead) => {
      const leadWithSegmentsString = {
        ...lead,
        // segments: lead.segments.map((segment) => segment.name).join(', '),
      };
      worksheet.addRow(leadWithSegmentsString);

      worksheet.addRow(lead);
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
    @Body() leadImportDto: LeadImportDto,
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
      'status',
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
    const leads = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const lead = {};
      [
        'address',
        'details',
        'status',
        'type',
        'phone',
        'email',
        'name',
        'source',
      ].forEach((header) => {
        const index = headers.indexOf(header);
        if (index !== -1) {
          lead[header] = row.getCell(index + 1).value;
        }
      });
      if (agent) {
        lead['agent'] = agent;
      }
      // If status is provided in leadImportDto, assign it to the lead
      if (leadImportDto.status) {
        lead['status'] = leadImportDto.status;
      }
      // If bucket is found, associate it with the lead
      if (segment) {
        lead['bucket'] = segment;
      }
      leads.push(lead);
    });
    try {
      const createdLeads = await this.leadsService.createMany(leads);
      res.status(201).json(createdLeads);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating leads');
    }
  }
  private normalizeHeader(header: string): string {
    return header.toLowerCase().trim();
  }

  private normalizeEnumValue(value: any, enumObject: any): string {
    const normalizedValue = String(value).toUpperCase().trim();
    const matchedEnumKey = Object.keys(enumObject).find(
      (key) => key.substring(0, 3) === normalizedValue.substring(0, 3),
    );
    return matchedEnumKey ? enumObject[matchedEnumKey] : normalizedValue;
  }

  @EventPattern('get_lead_by_id')
  async getCustomerName(data: { id: number }) {
    return this.leadsService.getOne(data.id);
  }
}
  