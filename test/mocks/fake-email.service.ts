import { EmailService, IEmailFirstLogin, IEmailRecoveryPassword } from '@/application/email/email.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeEmailService implements EmailService {
  async sendCodeVerify(_: IEmailRecoveryPassword): Promise<void> {
    // no-op
  }

  async sendEmailFirtLogin(_: IEmailFirstLogin): Promise<void> {
    // no-op
  }
}

