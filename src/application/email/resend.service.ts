import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  EmailService,
  IEmailFirstLogin,
  IEmailRecoveryPassword,
  IEmailSendProps,
} from './email.service';
import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import { EmailRecoveryCode } from '../templates-email/recovery-password';
import { CodeGeneratorService } from '@/common/code-generator/code-generator.service';
import { EmailFirstAcces } from '../templates-email/first-login';

@Injectable()
export class ResendService implements EmailService {
  private resend: Resend;

  constructor(
    private readonly config: ConfigService,
    private readonly codegenerator: CodeGeneratorService,
  ) {
    this.resend = new Resend(this.config.getOrThrow('RESEND_TOKEN'));
  }

  private async sendMail({
    to,
    subject,
    html,
  }: IEmailSendProps): Promise<void> {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
  }

  async sendCodeVerify({
    to,
    username,
  }: IEmailRecoveryPassword): Promise<void> {
    const propsReactElement = {
      username: String(username),
      code: String(this.codegenerator.generateCode()),
    };

    await this.sendMail({
      to,
      subject: 'Recuperar Senha',
      html: await render(EmailRecoveryCode(propsReactElement)),
    });
  }

  async sendEmailFirtLogin(props: IEmailFirstLogin): Promise<void> {
    const propsElement = {
      password: props.password,
    };

    await this.sendMail({
      to: props.to,
      subject: 'Primeiro Acesso',
      html: await render(EmailFirstAcces(propsElement)),
    });
  }
}
