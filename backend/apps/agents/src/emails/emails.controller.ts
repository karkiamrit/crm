import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('emails')
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List of all customers.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async findAll(@Query() query: any) {
    return this.emailsService.findAll(query);
  }

  @Post('/send')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Send Lead email' })
  @ApiBearerAuth()
  @ApiBody({ 
    description: 'Details for the email to be sent',
    type: 'object',
  })
  @ApiResponse({ status: 200, description: 'Email has been successfully sent.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async sendInvoice(
    @Body('email') email: string,
    @Body('leadId') id: string,
    @Body('text') text: string,
    @Body('subject') subject: string,
    @CurrentUser() user: User,
  ) {
    const leadId = Number(id);
    return this.emailsService.sendEmailToLead(
      email,
      leadId,
      text,
      user,
      subject,
    );
  }
}