import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  constructor() {
    super();
    const logs = new Logger();

    super.on('error', (err) => {
      logs.error(`[${new Date().toISOString()}]  Error Redis=${err.message}`);
      process.exit(1);
    });

    super.on('connect', () => {
      logs.debug('Redis Connected!');
    });
  }
}
