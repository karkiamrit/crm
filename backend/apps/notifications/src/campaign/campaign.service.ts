import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { Segment } from 'apps/agents/src/segments/entities/segment.entity';
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
    return this.campaignsRepository.findOneAndUpdate(
      { where: { id: id } },
      updateCampaignsDto,
    );
  }

  async delete(id: number) {
    return this.campaignsRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<Campaign>) {
    return this.campaignsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.campaignsRepository.findOne({ id });
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

      const compiledHtml = _.template(email.html_content, { interpolate: /\{(.+?)\}/g });
      const compiledText = _.template(email.text_content, { interpolate: /\{(.+?)\}/g });
      const html_content = compiledHtml({
        email: to,
        phone: phone,
        name: name,
      });

      const text_content = compiledText({
        email: to,
        phone: phone,
        name: name,
      });

      await transporter.sendMail({
        from: `${username}@homepapa.ca`,
        to: to,
        subject: email.subject,
        text: text_content,
        html: html_content,
      });

      return { status: 'success' };
    } catch (error: any) {
      console.error(`Failed to send email: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async sendCampain(campaignId: number, username: string) {
    try {
      const campaign = await this.campaignsRepository.findOne({
         id: campaignId,
      }, ['notification']);
      if (!campaign) {
        return { status: 'error', message: 'Campaign not found' };
      }
      const segmentId = campaign.segmentId;
      const segment = await firstValueFrom(
        this.segmentsService.send<Segment>('get_segment_by_id', { id: segmentId }),
      );
      if (!segment) {
        return { status: 'error', message: 'Segment not found' };
      }
      for (const lead of segment.leads) {
        console.log(`Sending email to ${lead.email}`);
        const result = await this.sendEmail(
          username,
          lead.email,
          lead.phone,
          lead.name,
          campaign.notification,
        );
        if (result.status === 'error') {
          console.error(
            `Failed to send email to ${lead.email}: ${result.message}`,
          );
        }
      }

      return { status: 'success' };
    } catch (e: any) {
      console.error(`Failed to send campaign: ${e}`);
      return { status: 'error', message: e.message };
    }
  }
}
