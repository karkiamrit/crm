import { Injectable, Logger } from '@nestjs/common';
import { CampaignsService } from '../campaign/campaign.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly campaignsService: CampaignsService) {}

  @Cron('*/60 * * * *') // Runs every 60 minutes
  async handleCron() {
    this.logger.debug('Checking campaigns to send...');
    const now = new Date();
    const campaigns = await this.campaignsService.findAll({
      where: (qb) => {
        qb.where('"sentStatus" = :sentStatus', { sentStatus: false })
          .andWhere('"sendTime" <= :currentDate', { currentDate: now })
          .andWhere('"isDraft" = :status', { status: false });
      },
    });
    for (const campaign of campaigns.data) {
      this.logger.debug(`Sending campaign ${campaign.id}`);
      if (
        campaign.sendTime &&
        campaign.sentStatus != true &&
        campaign.sendTime < now
      ) {
        await this.campaignsService.sendCampaign(campaign.id, 'sixcrm');
      }
    }
  }
}
