import { Injectable } from '@nestjs/common';
import { RefreshTokensRepository } from '@/application/repositories/refreshs-tokens.repository';

@Injectable()
export class InMemoryRefreshTokensRepository implements RefreshTokensRepository {
  private store = new Map<string, string>();

  async regiterToken(hash: string, refreshToken: string): Promise<void> {
    this.store.set(hash, refreshToken);
  }

  async getTokenByHash(hash: string): Promise<string> {
    return this.store.get(hash) ?? '';
  }

  async removeTokenByHash(hash: string): Promise<void> {
    this.store.delete(hash);
  }
}

