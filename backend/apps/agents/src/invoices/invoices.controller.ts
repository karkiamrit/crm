import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}


  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Upload Image' })
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('image', {
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
      limits: { fileSize: 1024 * 1024 }, // Limit the file size to 1MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if(file){
      return file.path;
    }
    return 'No file uploaded';
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateInvoiceDto })
  async create(
    @Body() createInvoicesDto: CreateInvoiceDto,
    @CurrentUser() user: User,
  ) {
    return await this.invoicesService.create(createInvoicesDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a invoice' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the invoice to update',
  })
  @ApiBody({ type: UpdateInvoiceDto })
  async update(
    @Param('id') id: number,
    @Body() updateInvoicesDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoicesDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a invoice' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the invoice to delete',
  })
  async delete(@Param('id') id: number) {
    return this.invoicesService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiBearerAuth()
  async findAll(@Query() query: any) {
    return this.invoicesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get an invoice by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the invoice',
  })
  async getOne(@Param('id') id: number) {
    return this.invoicesService.getOne(id);
  }

  @Post('/send')
  @UseInterceptors(
    FileInterceptor('invoice', {
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Only accept images
        if (!file.originalname.match(/\.(pdf)$/)) {
          // Reject file
          return callback(new Error('Only pdf is allowed!'), false);
        }
        // Accept file
        callback(null, true);
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Send Invoice email' })
  @ApiBearerAuth()
  async sendInvoice(
    @UploadedFile() file: Express.Multer.File,
    @Body('email') email: string,
    @Body('invoiceId') id: string,
    @CurrentUser() user: User,
  ) {
    let invoicePdf: any;
    const invoiceId = Number(id);
    if (file) {
      invoicePdf = file.path;
    }
    return this.invoicesService.sendInvoice(invoicePdf, email, invoiceId, user);
  }
}
