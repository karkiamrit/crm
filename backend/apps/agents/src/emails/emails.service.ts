import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EmailsRepository } from './emails.repository';
import { LeadsService } from '../leads/leads.service';
import { NOTIFICATIONS_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { tap } from 'rxjs';
import { EmailStatus } from './dto/enums/status.enum';
import { Email } from './entities/email.entity';

@Injectable()
export class EmailsService {
  constructor(
    private readonly emailsRepository: EmailsRepository,
    private readonly leadsService: LeadsService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,

   ){
    
  }

  async sendEmailToLead( email: string, id: number, text: string, user: User){
    const lead = await this.leadsService.getOne(id);
    if(!lead){
      throw new NotFoundException(`Lead #${id} not found`);
    }
    const username= user.email.split('@')[0];
    return this.notificationsService.send('send_email_to_lead', { username, to: email, text_content:text }).pipe(
      tap({
        next: async (response) => {
          console.log(`Email Sent successfully: ${response}`);
          const email =new Email({});
          email.status = EmailStatus.SENT;
          email.lead =lead;
          await this.emailsRepository.create(email);
        },
        error: async(error) => {
          const email =new Email({});
          email.status = EmailStatus.FAILED;
          email.lead =lead;
          await this.emailsRepository.create(email);
          console.error(`Failed to send email: ${error.message}`)
        },
      })
    );
  }
}
