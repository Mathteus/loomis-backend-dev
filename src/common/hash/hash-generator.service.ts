import { randomString } from '@/utility';
import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';

@Injectable()
export class HashGeneratorService {
  createSHA256(salt: string = randomString(10)) {
    const now = new Date().toISOString();
    return createHash('sha256').update(`${now}:${salt}`).digest('hex');
  }

  UUID() {
    return randomUUID();
  }
}
