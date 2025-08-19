// import { Inject, Injectable } from '@nestjs/common';
// import { RefreshTokensRepository } from '../repositories/refreshs-tokens.repository';
// import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

// @Injectable()
// export class RedisRefreshTokens implements RefreshTokensRepository {
//   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

//   async regiterToken(hash: string, refreshToken: string): Promise<void> {
//     const cachedUser = await this.cacheManager.get(`refreshsTokens`);
//     if (cachedUser) {
//       throw new RedisRefreshTokensNotExists();
//     }
//     const mapRefreshsTokens = new Map<string, string>(
//       JSON.parse(cachedUser) as Map<string, string>,
//     );
//   }
//   getTokenByHash(hash: string): Promise<string> {
//     throw new Error('Method not implemented.');
//   }
//   removeTokenByHash(hash: string): Promise<void> {
//     throw new Error('Method not implemented.');
//   }
// }

export class RedisRefreshTokensNotExists extends Error {
  constructor() {
    super('There is no refresh token in redis!');
  }
}

import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { RefreshTokensRepository } from '../repositories/refreshs-tokens.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const REFRESH_TOKENS_KEY = 'refresh_tokens';

@Injectable()
export class RedisRefreshTokensService extends RefreshTokensRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly redis: Redis) {
    super();
  }

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
