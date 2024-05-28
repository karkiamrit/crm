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
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import { UploadGuard } from './guards/upload.guard';
import { Request } from 'express';
import { UpdateTransactionTaskDto } from '../transaction-task/dto/update-transaction-task.dto';
import { TransactionTaskService } from '../transaction-task/transaction-task.service';

declare global {
  namespace Express {
    interface Request {
      taskId?: number;
    }
  }
}

@Controller('transactionDocuments')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly transactionTasksService : TransactionTaskService,
  ) {}

  @Post()
  @UseGuards(UploadGuard)
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
        if (
          !file.originalname.match(
            /\.(pdf|docx|xlsx|csv|doc|jpeg|gif|png|svg|jpg)$/,
          )
        ) {
          return callback(new Error('Only document files are allowed!'), false);
        }
        // Accept file
        callback(null, true);
      },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() request: Request,
    @CurrentUser() user: User,
    
  ) {
    const {taskId: dtoTaskId , ...seperatedCreateDocumentDto}= createDocumentDto;
    seperatedCreateDocumentDto.documentFile = file.path;
    let finalTaskId: number;
    if(request.taskId){
      finalTaskId = request.taskId;
    }
   else{
      finalTaskId = Number(dtoTaskId);
   }
    return this.documentsService.create(seperatedCreateDocumentDto, user, finalTaskId);
  }

  
  @Get('generate-upload-url/:taskId')
  async generateUploadUrl(@Param('taskId') taskId: number) {
    return await this.documentsService.generateUploadUrl(taskId);
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
    return this.documentsService.findAllByTaskId(query, id);
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
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id); 
  }

  @Put('/transactionTask/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
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
          const error = new HttpException('Only document files are allowed!', HttpStatus.BAD_REQUEST);
          return callback(error, false);
        }
        // Accept file
        callback(null, true);
      },
    }),
  )
  async updateTaskAndDocumentName(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateTransactionTasksDto: UpdateTransactionTaskDto,
  ) {
    let templateDocument: any;
    if (file) {
      templateDocument = file.path;
    }
    const task = await this.transactionTasksService.getOne(id);
    const document = task.officialDocs;
    if(document){
      await this.documentsService.update(document.id, {description: updateTransactionTasksDto.name});
    }
    const updateTransactionTasksDtoSeperated: UpdateTransactionTaskDto = {
      ...updateTransactionTasksDto,
      templateDocument,
    };
    return await this.transactionTasksService.update(id, updateTransactionTasksDtoSeperated);
  }

}
