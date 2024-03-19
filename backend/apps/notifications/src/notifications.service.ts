import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationsDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { otpEmailDto, resetPasswordEmailDto } from './dto/email.dto';
import { UpdateNotificationsDto } from './dto/update-notification.dto';
import { ExtendedFindOptions } from '@app/common';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly configService: ConfigService,
  ) {}

  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async create(createNotificationsDto: CreateNotificationsDto) {
    const notification = new Notification(createNotificationsDto);
    return await this.notificationsRepository.create(notification);
  }

  async update(id: number, updateNotificationsDto: UpdateNotificationsDto) {
    return this.notificationsRepository.findOneAndUpdate(
      { id },
      updateNotificationsDto,
    );
  }

  async delete(id: number) {
    return this.notificationsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Notification>): Promise<Notification[]> {
    return this.notificationsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.notificationsRepository.findOne({ id });
  }

  private async sendEmail(notificationEmaildto: NotifyEmailDto, email: string) {
    const notification = this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: notificationEmaildto.subject,
      text: notificationEmaildto.message,
    });
    return notification;
  }

  async sendOtpVerifyEmail(
    data: otpEmailDto,
    id: number,
  ): Promise<Notification | boolean> {
    const notification = await this.notificationsRepository.findOne({ id: id });
    if (!notification) return false;
    console.log(data);
    notification.message = notification.message.replace(
      'temporary',
      data.otpCode,
    );
    await this.sendEmail(notification, data.email);
  }

  async sendResetPasswordEmail(
    data: resetPasswordEmailDto,
    id: number,
  ): Promise<Notification | boolean> {
    const notification = await this.notificationsRepository.findOne({ id: id });
    if (!notification) return false;
    notification.message = notification.message.replace(
      'temporary',
      data.resetPasswordUrl,
    );
    console.log(notification);
    await this.sendEmail(notification, data.email);
  }
}
