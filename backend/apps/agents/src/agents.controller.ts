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
import { AgentsService } from './agents.service';
import { CreateAgentsDto, CreateAgentsDtoWithDocuments } from './dto/create-agent.dto';
import {  CurrentUser, JwtAuthGuard, Roles, User  } from '@app/common';
import { ApiOperation, ApiBearerAuth, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UpdateAgentDtoAdmin, UpdateAgentsDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AgentResponseDto } from './responses/agent.response.dto';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    ) {}
    
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateAgentsDto })
  @ApiResponse({ status: 201, description: 'The agent has been successfully created.', type: AgentResponseDto})
  @UseInterceptors(
    FilesInterceptor('documents', 10, { // 'documents' is the name of the field that should contain the files
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
    @Body() createAgentsDto: CreateAgentsDto,
    @CurrentUser() user: User
  ) {
    let documents:any;
    if(files){
      documents = files.map(file => file.path);
    }
    const createAgentsDtoWithDocuments: CreateAgentsDtoWithDocuments = { ...createAgentsDto, documents };
    return await this.agentsService.create(createAgentsDtoWithDocuments, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateAgentsDto })
  @ApiResponse({ status: 201, description: 'The agent has been successfully created.', type: AgentResponseDto})
  @UseInterceptors(
    FilesInterceptor('documents', 10, { // 'documents' is the name of the field that should contain the files
      storage: diskStorage({
        destination: './uploads', // specify the path where the files should be saved
        filename: (req, file, callback) => {
          const name = Date.now() + extname(file.originalname); // generate a unique filename
          callback(null, name);
        },
      }),
    }),
  )
  async adminCreate(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createAgentsDto: CreateAgentsDto,
    @Body('userId') userId: number,
  ) {
    let documents:any;
    if(files){
      documents = files.map(file => file.path);
    }
    const createAgentsDtoWithDocuments: CreateAgentsDtoWithDocuments = { ...createAgentsDto, documents };
    return await this.agentsService.createAgentAdmin(createAgentsDtoWithDocuments, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a agent' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the agent to update' })
  @ApiBody({ type: UpdateAgentsDto })
  @ApiResponse({ status: 200, description: 'The agent has been successfully updated.', type: AgentResponseDto})
  async update(
    @Param('id') id: number,
    @Body() updateAgentsDto: UpdateAgentsDto,
  ) {
    return this.agentsService.update(id, updateAgentsDto);
  }

  @Put(':id/admin_update')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a agent' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the agent to update' })
  @ApiBody({ type: UpdateAgentDtoAdmin })
  @ApiResponse({ status: 200, description: 'The agent has been successfully updated.', type: AgentResponseDto})
  async updateAgentByAdmin(
    @Param('id') id: number,
    @Body() updateAgentsDto: UpdateAgentDtoAdmin,
  ) {
    return this.agentsService.update(id, updateAgentsDto);
  }
  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a agent' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the agent to delete' })
  @ApiResponse({ status: 200, description: 'The agent has been successfully deleted.', type: AgentResponseDto})
  async delete(@Param('id') id: number) {
    return this.agentsService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get all agents' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all agents.', type: [AgentResponseDto]})
  async findAll(@Query() query: any): Promise<Agent[]>{
    return this.agentsService.findAll(query);
  }


  @Get('myprofile')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent') 
  @ApiOperation({ summary: 'Get current logged in agent profile' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the agent' })
  @ApiResponse({ status: 200, description: 'Return the agent.', type: AgentResponseDto})
  async getCurrentAgentProfile(@CurrentUser() user: User) {
    return this.agentsService.getAgentByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get an agent by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the agent' })
  @ApiResponse({ status: 200, description: 'Return the agent.', type: AgentResponseDto})
  async getOne(@Param('id') id: number) {
    return this.agentsService.getOne(id);
  }


  // @Get(':1/users')
  // @UseGuards(JwtAuthGuard)
  // @Roles('Agent')
  // @ApiOperation({ summary: 'Get users associated with agent' })
  // @ApiBearerAuth()
  // @ApiParam({ name: 'id', required: true, description: 'The id of the agent' })
  // @ApiResponse({ status: 200, description: 'Return the agent.', type: AgentResponseDto})
  // async getUsersByAgent(@Param('id') agentId: number, @Query() query:any) {
  //   return this.agentsService.getUserByAgentId(agentId, query);
  // }

  @Patch(':id/upload-documents')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload agent documents' })
  @ApiResponse({ status: 200, description: 'The documents have been successfully uploaded.'})
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
    @Param('id') id: number
  ): Promise<Agent> {
    const documents = files.map(file => file.path);
    return this.agentsService.addDocuments(id, documents);
  }

  @Patch(':id/update-document/:filename')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a document of an agent' })
  @ApiResponse({ status: 200, description: 'The document has been successfully updated.'})
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
    @Param('filename') filename: string
  ): Promise<Agent> {
    return this.agentsService.updateDocument(id, filename, file.path);
  }

  @Delete(':id/delete-document/:filename')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a document of an agent' })
  @ApiResponse({ status: 200, description: 'The document has been successfully deleted.'})
  async deleteDocument(
    @Param('id') id: number,
    @Param('filename') filename: string
  ): Promise<Agent> {
    return this.agentsService.deleteDocument(id, filename);
  }
}
