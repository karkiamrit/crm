import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from './organization.service';
import { CreateOrganizationsDto } from './dto/create-organization.dto';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import { ApiOperation, ApiBearerAuth, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UpdateOrganizationsDto } from './dto/update-organization.dto';
import { OrganizationReponseDto } from './responses/organization.response.dto';
import { Organization } from './entities/organization.entity';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    ) {}
    
  // @Post()
  // @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  // @ApiOperation({ summary: 'Create a new organization' })
  // @ApiBearerAuth()
  // @ApiBody({ type: CreateOrganizationsDto })
  // @ApiResponse({ status: 201, description: 'The organization has been successfully created.', type: OrganizationReponseDto})
  // async create(@Body() createOrganizationsDto: CreateOrganizationsDto) {
  //   return await this.organizationsService.create(createOrganizationsDto);
  // }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateOrganizationsDto })
  @ApiResponse({ status: 201, description: 'The organization has been successfully created.', type: OrganizationReponseDto})
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
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createOrganizationsDto: CreateOrganizationsDto,
  ) {
    console.log('pathis'+file.path)
    createOrganizationsDto.logo = file.path;
   
    return await this.organizationsService.create(createOrganizationsDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a organization' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the organization to update' })
  @ApiBody({ type: UpdateOrganizationsDto })
  @ApiResponse({ status: 200, description: 'The organization has been successfully updated.', type: OrganizationReponseDto})
  async update(
    @Param('id') id: number,
    @Body() updateOrganizationsDto: UpdateOrganizationsDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationsDto);
  }
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a organization' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the organization to delete' })
  @ApiResponse({ status: 200, description: 'The organization has been successfully deleted.', type: OrganizationReponseDto})
  async delete(@Param('id') id: number) {
    return this.organizationsService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all organizations.', type: [OrganizationReponseDto]})
  async findAll(@Query() query: any): Promise<Organization[]>{
    return this.organizationsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a organization by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the organization' })
  @ApiResponse({ status: 200, description: 'Return the organization.', type: OrganizationReponseDto})
  async getOne(@Param('id') id: number) {
    return this.organizationsService.getOne(id);
  }

  @Get(':1/users')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get users associated with organization' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the organization' })
  @ApiResponse({ status: 200, description: 'Return the organization.', type: OrganizationReponseDto})
  async getUsersByOrganization(@Param('id') organizationId: number, @Query() query:any) {
    return this.organizationsService.getUsersByOrganizationId(organizationId, query);
  }

  @Put(':id/upload-logo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload organization logo' })
  @ApiResponse({ status: 200, description: 'The logo has been successfully uploaded.'})
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
    }),
  )
  async updateLogo(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number
  ): Promise<Organization> {
    console.log(id)
    return this.organizationsService.updateLogo(id, file.path);
  }
}
