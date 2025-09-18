import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from '@/common/password-hasher/password-hasher';

@Injectable()
export class FakePasswordHasherService implements PasswordHasherService {
  async toHash(password: string): Promise<string> {
    return `hash:${password}`;
  }

  async compare(passwordRaw: string, passwordHashed: string): Promise<boolean> {
    return passwordHashed === `hash:${passwordRaw}`;
  }
}

