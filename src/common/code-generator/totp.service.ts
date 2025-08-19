import { ConfigService } from '@nestjs/config';
import { CodeGeneratorService } from './code-generator.service';
import { TOTP } from 'totp-generator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TotpService implements CodeGeneratorService {
  private token: string;

  constructor(private readonly config: ConfigService) {
    this.token = this.config.getOrThrow<string>('TOTP_CODE');
  }

  generateCode(): string {
    const { otp } = TOTP.generate(this.token, {
      digits: 6,
      period: 60 * 3,
      timestamp: new Date().getTime(),
    });
    return otp;
  }
}
