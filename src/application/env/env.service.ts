import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IEnvProps {
  PORT: number;
  DATABASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_TTL: number;
  X_API_KEY: string;
  TOTP_CODE: string;
  RESEND_TOKEN: string;
  JWT_TOKEN: string;
}

@Injectable()
export class EnviromentService {
  private readonly env: IEnvProps;

  constructor(private configService: ConfigService) {
    this.env = {
      PORT: this.configService.get<number>('PORT', 3333),
      DATABASE_URL: this.configService.get<string>(
        'DATABASE_URL',
        'DATABASE_URL',
      ),
      REDIS_HOST: this.configService.get<string>('REDIS_HOST', 'localhost'),
      REDIS_PORT: this.configService.get<number>('REDIS_PORT', 6379),
      REDIS_PASSWORD: this.configService.get<string>('REDIS_PASSWORD', 'redis'),
      REDIS_TTL: this.configService.get<number>('REDIS_TTL', 3600),
      X_API_KEY: this.configService.get<string>('X_API_KEY', 'X_API_KEY'),
      TOTP_CODE: this.configService.get<string>('TOTP_CODE', 'TOTP_CODE'),
      RESEND_TOKEN: this.configService.get<string>(
        'RESEND_TOKEN',
        'RESEND_TOKEN',
      ),
      JWT_TOKEN: this.configService.get<string>('JWT_TOKEN', 'JWT_TOKEN'),
    };
  }

  public get PORT(): number {
    return this.env.PORT;
  }

  public get DATABASE_URL(): string {
    return this.env.DATABASE_URL;
  }

  public get REDIS_HOST(): string {
    return this.env.REDIS_HOST;
  }

  public get REDIS_PORT(): number {
    return this.env.REDIS_PORT;
  }

  public get REDIS_PASSWORD(): string {
    return this.env.REDIS_PASSWORD;
  }

  public get REDIS_TTL(): number {
    return this.env.REDIS_TTL;
  }

  public get X_API_KEY(): string {
    return this.env.X_API_KEY;
  }

  public get TOTP_CODE(): string {
    return this.env.TOTP_CODE;
  }

  public get RESEND_TOKEN(): string {
    return this.env.RESEND_TOKEN;
  }

  public get JWT_TOKEN(): string {
    return this.env.JWT_TOKEN;
  }
}
