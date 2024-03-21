import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateLeadDto })
  @UseInterceptors(
    FilesInterceptor('documents', 10, {
      // 'documents' is the name of the field that should contain the files
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createLeadsDto: CreateLeadDto,
    @CurrentUser() user: User,
  ) {
    let documents:any;
    if(files){
      documents = files.map((file) => file.path);
    }
    
    const createLeadsDtoWithDocuments: CreateLeadDto = {
      ...createLeadsDto,
      documents,
    };
    return await this.leadsService.create(createLeadsDtoWithDocuments, user);
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

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get all leads' })
  @ApiBearerAuth()
  async findAll(@Query() query: any): Promise<Leads[]> {
    return this.leadsService.findAll(query);
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

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // @Roles('Lead')
  // @ApiOperation({ summary: 'Get a lead by id' })
  // @ApiBearerAuth()
  // @ApiParam({ name: 'id', required: true, description: 'The id of the lead' })
  // async getCurrentLeadProfile(@CurrentUser() user: User) {
  //   return this.leadsService.getLeadByUserId(user.id);
  // }

  @Patch(':id/upload-documents')
  @UseGuards(JwtAuthGuard)
  @Roles('Lead')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload lead documents' })
  @ApiResponse({
    status: 200,
    description: 'The documents have been successfully uploaded.',
  })
  @UseInterceptors(
    FilesInterceptor('documents', 10, {
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
    }),
  )
  async addDocuments(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: number,
  ): Promise<Leads> {
    const documents = files.map((file) => file.path);
    return this.leadsService.addDocuments(id, documents);
  }

  @Patch(':id/update-document/:filename')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a document of an lead' })
  @ApiResponse({
    status: 200,
    description: 'The document has been successfully updated.',
  })
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, req.params.filename); // use the existing filename
        },
      }),
    }),
  )
  async updateDocument(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
    @Param('filename') filename: string,
  ): Promise<Leads> {
    return this.leadsService.updateDocument(id, filename, file.path);
  }

  @Delete(':id/delete-document/:filename')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a document of an lead' })
  @ApiResponse({
    status: 200,
    description: 'The document has been successfully deleted.',
  })
  async deleteDocument(
    @Param('id') id: number,
    @Param('filename') filename: string,
  ): Promise<Leads> {
    return this.leadsService.deleteDocument(id, filename);
  }
}
