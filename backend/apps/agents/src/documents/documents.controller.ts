import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import { ApiBody, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
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
        if (
          !file.originalname.match(
            /\.(pdf|docx|xlsx|csv|doc|jpeg|gif|png|svg|jpg)$/,
          )
        ) {
          return callback(new Error('Only document files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Create a new document' })
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ status: 201, description: 'The document has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @CurrentUser() user: User,
  ) {
    createDocumentDto.documentFile = file.path;
    return this.documentsService.create(createDocumentDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Find all documents' })
  @ApiResponse({ status: 200, description: 'List of all documents.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  findAll(@Query() query: any) {
    return this.documentsService.findAll(query);
  }

  @Get('lead/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Find all documents by lead ID' })
  @ApiResponse({ status: 200, description: 'List of all documents for a specific lead.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  findAllByLeadId(@Query() query: any, @Param('id') id: number) {
    return this.documentsService.findAllByLeadId(query, id);
  }

  @Get('customer/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Find all documents by customer ID' })
  @ApiResponse({ status: 200, description: 'List of all documents for a specific customer.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  findAllByCustomerId(@Query() query: any, @Param('id') id: number) {
    return this.documentsService.findAllByCustomerId(query, id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Find one document by ID' })
  @ApiResponse({ status: 200, description: 'The document with the matching ID.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  findOne(@Param('id') id: string) {
    return this.documentsService.getOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname);
          callback(null, name);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Update a document' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({ status: 200, description: 'The document has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  update(
    @Param('id') id: string,
    @UploadedFile() documentFile: Express.Multer.File,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    if (documentFile) {
      updateDocumentDto.documentFile = documentFile.path;
    }

    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'The document has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }

}