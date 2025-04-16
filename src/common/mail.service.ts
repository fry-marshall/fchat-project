import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string, subject: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      template: 'verify-account',
      subject,
      context: {
        url,
        email,
      },
    });
  }
}
