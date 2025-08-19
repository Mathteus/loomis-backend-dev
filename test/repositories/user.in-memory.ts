import { AccountEntity } from '@/application/entities/account';
import {
  IVerifyUserRequest,
  AccountsRepository,
  IVerifyUserReponse,
} from '@/application/repositories/accounts-repository';
import { InMemoryDBService } from './in-memory.service';
import {
  AuthUserAlreadyRegistered,
  AuthUserNotExists,
} from '@/http/auth/auth.errors';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { delay } from '@/utility';

@Injectable()
export class InMemoryUserRepository implements AccountsRepository {
  constructor(private readonly database: InMemoryDBService<AccountEntity>) {}

  public async registerAccount(newUser: AccountEntity): Promise<void> {
    const found = this.database.findAll({
      company: newUser.company,
      username: newUser.username,
    });

    if (found.length) {
      throw new AuthUserAlreadyRegistered();
    }

    this.database.create(newUser, randomUUID());
    await delay(200);
  }

  public async searchAccountByEmail(
    currentUser: IVerifyUserRequest,
  ): Promise<IVerifyUserReponse> {
    await delay(200);
    const userFound = this.database.findAll({
      username: currentUser.email,
    });

    console.log(userFound);

    if (!userFound.length) {
      throw new AuthUserNotExists();
    }

    return {
      id: String(userFound[0].id),
      hash: String(userFound[0].password),
    };
  }

  async getAllAccounts(): Promise<Array<AccountEntity>> {
    await delay(200);
    return this.database.findAll();
  }
}
