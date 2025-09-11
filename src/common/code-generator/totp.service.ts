import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CodeGeneratorService } from './code-generator';
import { TOTP } from 'totp-generator';

@Injectable()
export class TotpService implements CodeGeneratorService {
  private readonly token: string;

  constructor(private readonly config: ConfigService) {
    this.token = this.config.getOrThrow<string>('TOTP_CODE');
  }

  async generateCode() {
    const { otp } = await TOTP.generate(this.token, {
      digits: 6,
      period: 60 * 3,
      timestamp: Date.now(),
    });
    return otp;
  }
}
