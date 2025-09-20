// export class RedisRefreshTokensNotExists extends Error {
//   constructor() {
//     super('There is no refresh token in redis!');
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { RedisService } from './config/redis.service';
// import { RefreshTokensRepository } from '../repositories/refreshs-tokens.repository';
// import { randomString } from '@/utility';
// import { createHash } from 'node:crypto';

// const REFRESH_TOKENS_KEY = 'refresh_tokens';

// @Injectable()
// export class RedisRefreshTokensService implements RefreshTokensRepository {
//   constructor(private readonly redis: RedisService) {}

//   private getHash() {
//     const now = new Date().toISOString();
//     const hash = createHash('sha256')
//       .update(`${now}:${randomString(10)}`)
//       .digest('hex');
//     return hash;
//   }

//   async regiterToken(accountId: string): Promise<string> {
//     const hash = this.getHash();
//     await this.redis.hset(REFRESH_TOKENS_KEY, hash, accountId);
//     return hash;
//   }

//   async getTokenByHash(hash: string): Promise<string> {
//     const token = await this.redis.hget(REFRESH_TOKENS_KEY, hash);
//     if (!token) {
//       throw new RedisRefreshTokensNotExists();
//     }
//     return token;
//   }

//   async removeTokenByHash(hash: string): Promise<void> {
//     const exists = await this.redis.hexists(REFRESH_TOKENS_KEY, hash);
//     if (!exists) {
//       throw new RedisRefreshTokensNotExists();
//     }
//     await this.redis.hdel(REFRESH_TOKENS_KEY, hash);
//   }
// }
