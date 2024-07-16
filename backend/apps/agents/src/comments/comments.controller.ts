import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBearerAuth()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiBearerAuth()
  async delete(@Param('id') id: number) {
    return this.commentsService.delete(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  async findAll(@Query() query: any) {
    return this.commentsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single comment' })
  @ApiBearerAuth()
  async getOne(@Param('id') id: number) {
    return this.commentsService.getOne(id);
  }
}