import { createHash } from 'node:crypto';
import { RefreshTokensRepository } from '../repositories/refreshs-tokens.repository';
import { PrismaService } from './config/prisma.service';
import { randomString } from '@/utility';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaRefreshTokenService implements RefreshTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getHash() {
    const now = new Date().toISOString();
    const hash = createHash('sha256')
      .update(`${now}:${randomString(10)}`)
      .digest('hex');
    return hash;
  }

  async regiterToken(accountId: string): Promise<string> {
    const tokenFound = await this.prisma.refresh_token.findFirst({
      where: {
        accountid: accountId,
      },
    });

    const hash = this.getHash();
    if (tokenFound) {
      const updatedToken = await this.prisma.refresh_token.update({
        where: {
          refreshid: tokenFound.refreshid,
          hash: tokenFound.hash,
        },
        data: {
          last_validation: new Date(),
          hash,
        },
      });
      return updatedToken?.hash;
    }

    const newToken = await this.prisma.refresh_token.create({
      data: {
        accountid: accountId,
        hash,
      },
    });
    return newToken?.hash;
  }

  async getTokenByHash(hash: string): Promise<string> {
    const tokenFound = await this.prisma.refresh_token.findFirst({
      where: {
        hash,
      },
    });
    return tokenFound?.hash ?? '';
  }

  async removeTokenByHash(hash: string): Promise<void> {
    await this.prisma.refresh_token.delete({
      where: {
        hash,
      },
    });
  }
}
