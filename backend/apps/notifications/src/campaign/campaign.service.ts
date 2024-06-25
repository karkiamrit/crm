import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CampaignsRepository } from './campaign.repository';
import { Campaign } from './entities/campaign.entity';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ExtendedFindOptions, SEGMENT_SERVICE } from '@app/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { NotificationsService } from '../notifications.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Notification } from '../entities/notification.entity';
import * as _ from 'lodash';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationsService,
    @Inject(SEGMENT_SERVICE)
    private readonly segmentsService: ClientProxy,
  ) {}

  async create(createCampaignsDto: CreateCampaignDto, notificationId: number) {
    const notification = await this.notificationService.getOne(notificationId);
    const campaign = new Campaign(createCampaignsDto);
    campaign.notification = notification;
    return await this.campaignsRepository.create(campaign);
  }

  async update(id: number, updateCampaignsDto: UpdateCampaignDto) {
    const { notificationId, ...rest } = updateCampaignsDto;
    let notification: any;
    if (updateCampaignsDto.notificationId) {
      notification = await this.notificationService.getOne(notificationId);
    }
    const newCampaign = new Campaign(rest);
    newCampaign.notification = notification;
    const updatedCampaign = await this.campaignsRepository.findOneAndUpdate(
      { where: { id: id } },
      newCampaign,
    );
    return updatedCampaign;
  }

  async delete(id: number) {
    return this.campaignsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Campaign>) {
    options.relations = ['notification'];
    return this.campaignsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.campaignsRepository.findOne({ id }, ['notification']);
  }

  async sendEmail(
    username: string,
    to: string,
    phone: string,
    name: string,
    email: Notification,
  ) {
    try {
      const transporter = nodemailer.createTransport({
        host: this.configService.get('CAMPAIGN_HOST'),
        port: this.configService.get('CAMPAIGN_PORT'),
        secure: false,
        auth: {
          user: username,
          pass: this.configService.get('CAMPAIGN_SMTP_PASSWORD'),
        },
        connectionTimeout: 60000,
      });
      console.log(`html_content: ${email.html_content}`);
      console.log(`text_content: ${email.text_content}`);
      // const compiledHtml = _.template(email.html_content, {
      //   interpolate: /\{(.+?)\}/g,
      // });

      // const compiledText = _.template(email.text_content, {
      //   interpolate: /\{(.+?)\}/g,
      // });
      // const html_content = compiledHtml({
      //   email: to,
      //   phone: phone,
      //   name: name,
      // });

      // const text_content = compiledText({
      //   email: to,
      //   phone: phone,
      //   name: name,
      // });

      const html_content = email.html_content
        .replace(/\{email\}/g, to)
        .replace(/\{phone\}/g, phone)
        .replace(/\{name\}/g, name);

      const text_content = email.text_content
        .replace(/\{email\}/g, to)
        .replace(/\{phone\}/g, phone)
        .replace(/\{name\}/g, name);

      await transporter.sendMail({
        from: `${username}@homepapa.ca`,
        to: to,
        subject: email.subject,
        text: text_content,
        html: html_content,
      });

      return { status: 'success' };
    } catch (e: any) {
      console.error(`Failed to send email: ${e.message}`);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendCampaign(campaignId: number, username: string) {
    try {
      const campaign = await this.campaignsRepository.findOne(
        {
          id: campaignId,
        },
        ['notification'],
      );
      if (!campaign) {
        return { status: 'error', message: 'Campaign not found' };
      }
      if (campaign.sentStatus === true) {
        throw new ConflictException('Campaign already sent');
      }
      if (campaign.isDraft === true) {
        throw new ConflictException(
          'Please complete the campaign details before inititating send',
        );
      }
      const segmentId = campaign.segmentId;
      const segment = await firstValueFrom(
        this.segmentsService.send<any>('get_segment_by_id', { id: segmentId }),
      );
      if (!segment) {
        return { status: 'error', message: 'Segment not found' };
      }
      for (const lead of segment.leads) {
        const result = await this.sendEmail(
          username,
          lead.email,
          lead.phone,
          lead.name,
          campaign.notification,
        );
        if (result.status === 'error') {
          console.error(`Failed to send email to ${lead.email}: ${result}`);
        }
      }
      campaign.sentStatus = true;
      await this.campaignsRepository.findOneAndUpdate(
        { where: { id: campaign.id } },
        campaign,
      );
      return { status: 'success' };
    } catch (e: any) {
      console.error(`Failed to send campaign: ${e}`);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendInvoiceEmail(username: string, to: string, text_content: string, subject?:string) {
    try {
      const transporter = nodemailer.createTransport({
        host: this.configService.get('CAMPAIGN_HOST'),
        port: this.configService.get('CAMPAIGN_PORT'),
        secure: false,
        auth: {
          user: username,
          pass: this.configService.get('CAMPAIGN_SMTP_PASSWORD'),
        },
        connectionTimeout: 60000,
      });
      await transporter.sendMail({
        from: `${username}@homepapa.ca`,
        to: to,
        subject: subject ? subject : 'Invoice',
        html: `<html>Please click the link below to view or download your invoice :  <a href="http://${text_content}">${text_content}</a></html>`,
      });

      return { status: 'success' };
    } catch (e: any) {
      console.error(`Failed to send email: ${e.message}`);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
