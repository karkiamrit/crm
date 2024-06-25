import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationsDto } from './dto/create-notification.dto';
import { CurrentUser, JwtAuthGuard, Roles, User} from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { otpEmailDto, resetPasswordEmailDto } from './dto/email.dto';
import { ApiOperation, ApiBearerAuth, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UpdateNotificationsDto } from './dto/update-notification.dto';
import { NotificationResponseDto } from './responses/notification.response';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateNotificationsDto })
  @ApiResponse({ status: 201, description: 'The notification has been successfully created.', type: NotificationResponseDto})
  async create(@Body() createNotificationsDto: CreateNotificationsDto, @CurrentUser() user: User) {
    return await this.notificationsService.create(createNotificationsDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the notification to update' })
  @ApiBody({ type: UpdateNotificationsDto })
  @ApiResponse({ status: 200, description: 'The notification has been successfully updated.', type: NotificationResponseDto})
  async update(
    @Param('id') id: number,
    @Body() updateNotificationsDto: UpdateNotificationsDto,
    @CurrentUser() user: User
  ) {
    return this.notificationsService.update(id, updateNotificationsDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Agent')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the notification to delete' })
  @ApiResponse({ status: 200, description: 'The notification has been successfully deleted.', type: NotificationResponseDto})
  async delete(@Param('id') id: number) {
    return this.notificationsService.delete(id);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @Roles('Agent')
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all notifications.', type: [NotificationResponseDto]})
  async findAll(@Query() query: any){
    console.log("reached here")
    return this.notificationsService.findAll(query);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // @Roles('Agent')
  @ApiOperation({ summary: 'Get a notification by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the notification' })
  @ApiResponse({ status: 200, description: 'Return the notification.', type: NotificationResponseDto})
  async getOne(@Param('id') id: number) {
    return this.notificationsService.getOne(id);
  }

  @EventPattern('send_otp')
  async handleSendOtpVerifyEmail(@Payload() data: otpEmailDto) {
    this.notificationsService.sendOtpVerifyEmail(data, 1);
  }

  @EventPattern('send_reset_password')
  async handleSendResetPasswordEmail(@Payload() data: resetPasswordEmailDto) {
    this.notificationsService.sendResetPasswordEmail(data, 2);
  }
}
