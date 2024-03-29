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
import { JwtAuthGuard, Roles, User } from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { otpEmailDto, resetPasswordEmailDto } from './dto/email.dto';
import { ApiOperation, ApiBearerAuth, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UpdateNotificationsDto } from './dto/update-notification.dto';
import { NotificationResponseDto } from './responses/notification.response';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  // @Roles('Admin')
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateNotificationsDto })
  @ApiResponse({ status: 201, description: 'The notification has been successfully created.', type: NotificationResponseDto})
  async create(@Body() createNotificationsDto: CreateNotificationsDto) {
    return await this.notificationsService.create(createNotificationsDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a notification' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the notification to update' })
  @ApiBody({ type: UpdateNotificationsDto })
  @ApiResponse({ status: 200, description: 'The notification has been successfully updated.', type: NotificationResponseDto})
  async update(
    @Param('id') id: number,
    @Body() updateNotificationsDto: UpdateNotificationsDto,
  ) {
    return this.notificationsService.update(id, updateNotificationsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the notification to delete' })
  @ApiResponse({ status: 200, description: 'The notification has been successfully deleted.', type: NotificationResponseDto})
  async delete(@Param('id') id: number) {
    return this.notificationsService.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all notifications.', type: [NotificationResponseDto]})
  async findAll(@Query() query: any): Promise<Notification[]> {
    console.log("reached here")
    return this.notificationsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a notification by id' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, description: 'The id of the notification' })
  @ApiResponse({ status: 200, description: 'Return the notification.', type: NotificationResponseDto})
  async getOne(@Param('id') id: number) {
    return this.notificationsService.getOne(id);
  }

  @EventPattern('send_otp')
  async handleSendOtpVerifyEmail(@Payload() data: otpEmailDto) {
    console.log('here is reached')
    this.notificationsService.sendOtpVerifyEmail(data, 1);
  }

  @EventPattern('send_reset_password')
  async handleSendResetPasswordEmail(@Payload() data: resetPasswordEmailDto) {
    this.notificationsService.sendResetPasswordEmail(data, 2);
  }
}
