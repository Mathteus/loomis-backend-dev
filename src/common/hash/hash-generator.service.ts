import { randomString } from '@/utility';
import { createHash, randomUUID } from 'node:crypto';

export class HashGenerator {
  createSHA256(salt: string = randomString(10)) {
    const now = new Date().toISOString();
    return createHash('sha256').update(`${now}:${salt}`).digest('hex');
  }

  UUID() {
    return randomUUID();
  }
}
