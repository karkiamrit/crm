import { Injectable } from '@nestjs/common';
import { CampaignsRepository } from './campaign.repository';
import { Campaign } from './entities/campaign.entity';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ExtendedFindOptions } from '@app/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationsService,
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

  async sendEmail(username: string) {
    try {
      console.log(username);
      const transporter = nodemailer.createTransport({
        host: this.configService.get('CAMPAIGN_HOST'),
        port: this.configService.get('CAMPAIGN_PORT'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: username,
          pass: 'md-bCrwAVFpRF36B7Iz7TZLHw',
        },
        connectionTimeout: 60000
      });
      console.log(this.configService.get('CAMPAIGN_PASSWORD'))
      const notification = await transporter.sendMail({
        from: `sixcrm@homepapa.ca`,
        to: 'sixcrm@homepapa.ca',
        subject: 'hello world',
        text: 'hi there',
      });
      return notification;
    } catch (error) {
      console.error(`Failed to send email: ${error}`);
      throw error;
    }
  }
}