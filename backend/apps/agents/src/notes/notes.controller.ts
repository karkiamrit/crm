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
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: User,
  ) {
    return this.notesService.create(createNoteDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  async update(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: User,
  ) {
    return this.notesService.update(id, updateNoteDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  async delete(@Param('id') id: number) {
    return this.notesService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: any) {
    return this.notesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: number) {
    return this.notesService.getOne(id);
  }
}
