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
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
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
  async delete(@Param('id') id: number) {
    return this.commentsService.delete(id);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: any) {
    return this.commentsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: number) {
    return this.commentsService.getOne(id);
  }
}
