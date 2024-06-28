import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationsDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { otpEmailDto, resetPasswordEmailDto } from './dto/email.dto';
import { UpdateNotificationsDto } from './dto/update-notification.dto';
import { ExtendedFindOptions, User } from '@app/common';
import { template } from 'lodash';
import { templateType } from './dto/enums/template.type';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly configService: ConfigService,
  ) {}

  // private readonly transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     type: 'OAuth2',
  //     user: this.configService.get('SMTP_USER'),
  //     clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
  //     clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
  //     refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
  //   },
  // });

  private readonly transporter = nodemailer.createTransport({
    host: this.configService.get('SMTP_HOST'),
    port: this.configService.get('SMTP_PORT'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: this.configService.get('SMTP_USER'),
      pass: this.configService.get('SMTP_PASSWORD'),
    },
    connectionTimeout: 60000,
  });

  async create(createNotificationsDto: CreateNotificationsDto, user: User) {
    const notification = new Notification(createNotificationsDto);
    notification.creatorId = user.id;
    return await this.notificationsRepository.create(notification);
  }

  async update(
    id: number,
    updateNotificationsDto: UpdateNotificationsDto,
    user: User,
  ) {
    const notification = await this.getOne(+id);
    if (
      notification.creatorId === user.id ||
      notification.type === templateType.NONDEFAULT
    ) {
      return this.notificationsRepository.findOneAndUpdate(
        { where: { id: id } },
        updateNotificationsDto,
      );
    } else {
      throw new Error('You are not permitted to update this template');
    }
  }

  async delete(id: number) {
    return this.notificationsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Notification>) {
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
      text: template(notificationEmaildto.text_content)({
        value: notificationEmaildto.html_content,
      }),
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
    notification.text_content = template(notification.text_content)({
      value: data.otpCode,
    });
    notification.html_content = template(notification.html_content)({
      value: data.otpCode,
    });
    if (!(await this.sendEmail(notification, data.email))) {
      throw new Error('Email not sent');
    }
  }

  async sendResetPasswordEmail(
    data: resetPasswordEmailDto,
    id: number,
  ): Promise<Notification | boolean> {
    const notification = await this.notificationsRepository.findOne({ id: id });
    if (!notification) return false;
    notification.text_content = template(notification.text_content)({
      value: data.resetPasswordUrl,
    });
    notification.html_content = template(notification.html_content)({
      value: data.resetPasswordUrl,
    });
    if (!(await this.sendEmail(notification, data.email))) {
      throw new Error('Email not sent');
    }
  }
}
