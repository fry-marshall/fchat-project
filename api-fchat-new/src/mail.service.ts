import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailResetPassword(email: string, url: string) {
    const logoPath = path.join(__dirname, '..', 'assets', 'images', 'logo.png');
    const logoBase64 = fs.readFileSync(logoPath, 'base64');

    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialiser votre mot de passe',
      template: 'reset-password',
      context: {
        email,
        url,
        base64Logo: logoBase64,
      },
    });
  }
}
