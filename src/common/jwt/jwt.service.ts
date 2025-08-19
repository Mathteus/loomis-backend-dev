import { JwtEntity } from '@/application/entities/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface IJwtBody {
  payload: JwtEntity;
  customTime: string;
}

@Injectable()
export class JwtOwnService {
  private JWT_TOKEN: string;

  constructor(
    private readonly jwtNest: JwtService,
    private readonly config: ConfigService,
  ) {
    this.JWT_TOKEN = this.config.getOrThrow<string>('JWT_TOKEN');
  }

  public async sign({ payload, customTime }: IJwtBody): Promise<string> {
    return await this.jwtNest.signAsync(payload.toPlainObject(), {
      secret: this.JWT_TOKEN,
      expiresIn: customTime,
    });
  }

  public async verify(payload: string): Promise<JwtEntity> {
    return await this.jwtNest.verifyAsync<JwtEntity>(payload, {
      secret: this.JWT_TOKEN,
    });
  }
}
