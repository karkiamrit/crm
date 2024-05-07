import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|docx|xlsx|csv|doc|jpeg|gif|png|svg|jpg)$/)) {
          return callback(new Error('Only document files are allowed!'), false);
        }
        // Accept file
        callback(null, true);
      },
    }),
  )
  create(@UploadedFile() file: Express.Multer.File, @Body() createDocumentDto: CreateDocumentDto, @CurrentUser() user: User) {
    createDocumentDto.documentFile = file.path;
    return this.documentsService.create(createDocumentDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  findAll(@Query() query: any) {
    return this.documentsService.findAll(query);
  }

  @Get('lead/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  findAllByLeadId(@Query() query: any, @Param('id') id: number) {
    return this.documentsService.findAllByLeadId(query, id);
  }

  
  @Get('customer/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  findAllByCustomerId(@Query() query: any, @Param('id') id: number) {
    return this.documentsService.findAllByCustomerId(query, id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
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
  update(@Param('id') id: string, @UploadedFile() documentFile: Express.Multer.File, @Body() updateDocumentDto: UpdateDocumentDto) {
    if(documentFile){
      updateDocumentDto.documentFile = documentFile.path;
    }
   
    return this.documentsService.update(+id, updateDocumentDto);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
  
  //only for test of notification
  @Post()
  async handleWebhook(@Body() data: any): Promise<string> {
    try {
      // Process the webhook data here...
      console.log(data);

      // If everything is successful, return a success message
      return 'Webhook received!';
    } catch (error) {
      console.error(`Failed to process webhook: ${error}`);
      throw new HttpException('Failed to process webhook', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // @Post(':id/append')
  // @UseInterceptors(
  //   FileInterceptor('documentFile', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         const name = Date.now() + extname(file.originalname);
  //         callback(null, name);
  //       },
  //     }),
  //   }),
  // )
  // append(@Param('id') id: string, @UploadedFile() documentFile: Express.Multer.File) {
  //   return this.documentsService.append(+id, documentFile.path);
  // }
}
