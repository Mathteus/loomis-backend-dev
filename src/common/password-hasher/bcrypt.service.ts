import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from './password-hasher';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements PasswordHasherService {
  private readonly SALT_ROUNDS = 12;

  async toHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  compare(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword);
  }
}
