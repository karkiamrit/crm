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
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Workbook } from 'exceljs';
import { Response } from 'express';

import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
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
import { LeadsStatus, LeadType } from '../shared/data';

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly agentService: AgentsService,
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
    const createLeadsDtoWithDocuments: CreateLeadDto = {
      ...createLeadsDto,
      profilePicture,
    };
    if (referenceNo.referenceNo === "" || null || undefined) {
      return await this.leadsService.create(createLeadsDtoWithDocuments);
    } else {
      agent = await this.agentService.getOneByReferenceNo(
        referenceNo.referenceNo,
      );
      if (!agent) {
        throw new NotFoundException(
          `Agent with reference no ${referenceNo.referenceNo} not found`
        );
      }
    }
    return await this.leadsService.create(createLeadsDtoWithDocuments, agent);
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
  ){
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
    return this.leadsService.findAllWithSegmentId(query,id);
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
  @ApiResponse({ status: 200, description: 'The picture has been successfully uploaded.'})
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

    // Define columns in the worksheet
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Address', key: 'address', width: 32 },
      { header: 'Details', key: 'details', width: 32 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Priority', key: 'priority', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Source', key: 'source', width: 15 },
      { header: 'Documents', key: 'documents', width: 15 },
      { header: 'Agent Id', key: 'agentId', width: 10 },
      { header: 'Product Id', key: 'productId', width: 10 },
      { header: 'Service Id', key: 'serviceId', width: 10 },
    ];

    // Add rows to the worksheet
    leads.data.forEach((lead) => {
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
        if (!file.originalname.match(/\.(csv|xlsx|ods)$/)) {
          return callback(new Error('Only CSV files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async import(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const workbook = new Workbook();

    await workbook.csv.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);
    
    const requiredHeaders = ['phone', 'email', 'name'].map(this.normalizeHeader);;
    const optionalHeaders = ['address', 'details', 'status', 'type', 'source', 'product', 'service', 'profilepicture'].map(this.normalizeHeader);    const headers = worksheet.getRow(1).values as string[];  
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return ({ message: `Missing required headers: ${missingHeaders.join(', ')}` });
    }
  
    const leads = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const lead = {
        address: row.getCell(headers.indexOf('address') + 1).value,
        details: row.getCell(headers.indexOf('details') + 1).value,
        status: LeadsStatus[this.normalizeEnumValue(row.getCell(headers.indexOf('status') + 1).value, LeadsStatus)],        
        type: LeadType[this.normalizeEnumValue(row.getCell(headers.indexOf('type') + 1).value, LeadType)],     
        phone: row.getCell(headers.indexOf('phone') + 1).value,
        email: row.getCell(headers.indexOf('email') + 1).value,
        name: row.getCell(headers.indexOf('name') + 1).value,
        source: row.getCell(headers.indexOf('source') + 1).value,
        product: row.getCell(headers.indexOf('product') + 1).value,
        service: row.getCell(headers.indexOf('service') + 1).value,
      };
      leads.push(lead);
    });
  
    await this.leadsService.createMany(leads);
    return({ message: 'Leads imported successfully' });
  }

  private normalizeEnumValue(value: any, enumObject: any): string {
    const normalizedValue = String(value).toUpperCase().trim();
    const matchedEnumKey = Object.keys(enumObject).find(key => 
      key.substring(0, 3) === normalizedValue.substring(0, 3)
    );
    return matchedEnumKey ? enumObject[matchedEnumKey] : normalizedValue;
  }

  private normalizeHeader(header: string): string {
    return header.toLowerCase().trim();
  }
  
}

