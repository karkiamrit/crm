import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { CurrentUser, JwtAuthGuard, Roles, User } from '@app/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiBearerAuth()
  async findAll(@Query() query: any) {
    return this.emailsService.findAll(query);
  }

  @Post('/send')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Send Lead email' })
  @ApiBearerAuth()
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
