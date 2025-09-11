export class RedisRefreshTokensNotExists extends Error {
  constructor() {
    super('There is no refresh token in redis!');
  }
}

import { Injectable } from '@nestjs/common';
import { RedisService } from './config/redis.service';
import { RefreshTokensRepository } from '../repositories/refreshs-tokens.repository';

const REFRESH_TOKENS_KEY = 'refresh_tokens';

@Injectable()
export class RedisRefreshTokensService implements RefreshTokensRepository {
  constructor(private readonly redis: RedisService) {}

  async regiterToken(hash: string, accountId: string): Promise<void> {
    await this.redis.hset(REFRESH_TOKENS_KEY, hash, accountId);
  }

  async getTokenByHash(hash: string): Promise<string> {
    const token = await this.redis.hget(REFRESH_TOKENS_KEY, hash);

    if (!token) {
      throw new RedisRefreshTokensNotExists();
    }

    return token;
  }

  async removeTokenByHash(hash: string): Promise<void> {
    const exists = await this.redis.hexists(REFRESH_TOKENS_KEY, hash);

    if (!exists) {
      throw new RedisRefreshTokensNotExists();
    }

    await this.redis.hdel(REFRESH_TOKENS_KEY, hash);
  }
}
