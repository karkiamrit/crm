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
  
  private readonly transporter = nodemailer.createTransport({
    host: this.configService.get('SMTP_HOST'),
    port: this.configService.get('SMTP_PORT'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: this.configService.get('SMTP_USER'),
      pass: this.configService.get('SMTP_PASSWORD'),
    },
    connectionTimeout: 60000
  });

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

  
}