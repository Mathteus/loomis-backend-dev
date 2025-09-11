import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IS_PROTECTED_KEY } from '@/decorators/protected.decorator';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtStrategy } from './jwt.strategy';
import { IS_RESET_TICKET } from '@/decorators/reset-ticket.decorator';
import { IS_RECOVERY_TICKET } from '@/decorators/recovery-ticket.decorator';
import { RedisRefreshTokensService } from '@/application/database/redis-refresh-token';

interface JwtPayload {
  body?: unknown;
  sub: string;
  type: string;
}

@Injectable()
export class AuthGuard extends JwtStrategy {
  private jwtSecret: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly refreshTokensCache: RedisRefreshTokensService,
  ) {
    super(configService);
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_TOKEN');
  }

  private async customJwtVerify(token: string, request: any) {
    try {
      const recoveryJwt: JwtPayload = await this.jwt.verifyAsync(token, {
        secret: this.jwtSecret,
        ignoreExpiration: false,
      });

      const response = await this.refreshTokensCache.getTokenByHash(
        recoveryJwt.sub,
      );
      if (response) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        request['user'] = response;
        await this.refreshTokensCache.removeTokenByHash(recoveryJwt.sub);
      }
    } catch {
      throw new UnauthorizedException();
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Explicitly type request as Request to avoid unsafe member access
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const tokenXApiKey = this.extractXApiKeyFromHeader(request);
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      IS_PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );
    const isRecoveryTicket = this.reflector.getAllAndOverride<boolean>(
      IS_RECOVERY_TICKET,
      [context.getHandler(), context.getClass()],
    );
    const isResetTicket = this.reflector.getAllAndOverride<boolean>(
      IS_RESET_TICKET,
      [context.getHandler(), context.getClass()],
    );

    if (!tokenXApiKey) {
      throw new UnauthorizedException();
    }

    if (isProtected && tokenXApiKey) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    if (isRecoveryTicket && tokenXApiKey) {
      await this.customJwtVerify(token, request);
    }

    if (isResetTicket && tokenXApiKey) {
      await this.customJwtVerify(token, request);
    }

    try {
      request['user'] = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.jwtSecret,
        ignoreExpiration: false,
      });
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }

  private extractXApiKeyFromHeader(request: Request): boolean {
    const token = request.headers['x-api-key'];
    return token === this.configService.getOrThrow<string>('X_API_KEY');
  }
}
