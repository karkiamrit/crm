import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaign.service';
import { CurrentUser, JwtAuthGuard, Roles, User} from '@app/common';
import { ApiOperation, ApiBearerAuth, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCampaignDto })
  @ApiResponse({ status: 201, description: 'The campaign has been successfully created.'})
  async create(@Body() createCampaignDto: CreateCampaignDto, @Body('notificationId') notificationId: number) {
    return await this.campaignsService.create(createCampaignDto, notificationId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the campaign to update' })
  @ApiBody({ type: UpdateCampaignDto })
  @ApiResponse({ status: 200, description: 'The campaign has been successfully updated.'})
  async update(
    @Param('id') id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a campaign' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the campaign to delete' })
  @ApiResponse({ status: 200, description: 'The campaign has been successfully deleted.'})
  async delete(@Param('id') id: number) {
    return this.campaignsService.delete(id);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all campaigns.'})
  async findAll(@Query() query: any){
    return this.campaignsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a campaign by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the campaign' })
  @ApiResponse({ status: 200, description: 'Return the campaign.'})
  async getOne(@Param('id') id: number) {
    return this.campaignsService.getOne(id);
  }

  @Post('/send')
  @UseGuards(JwtAuthGuard)
  async sendCampaign(
    @Body('campaignId') campaignId: number ,
    @CurrentUser() user: User,
  ) {
    return await this.campaignsService.sendCampaign(campaignId, user.email.split('@')[0]);
  }

  @EventPattern('send_invoice_email')
  async handleSendEmail(@Payload() data: {
    username: string,
    to: string,
    text_content: string,
  }) {
    try {
      return await this.campaignsService.sendInvoiceEmail(data.username, data.to, data.text_content);
    } catch (e: any) {
      console.error(`Failed to send email: ${e.message}`);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @EventPattern('send_email_to_lead')
  async handleLeadEmail(@Payload() data: {
    username: string,
    to: string,
    text_content: string,
    subject?: string,
  }) {
    try {
      return await this.campaignsService.sendInvoiceEmail(data.username, data.to, data.text_content, data.subject);
    } catch (e: any) {
      console.error(`Failed to send email: ${e.message}`);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
