import { Injectable } from '@nestjs/common';
import {
  AccountsRepository,
  IRegisterProps,
  IVerifyUserReponse,
} from '@/application/repositories/accounts-repository';
import { randomUUID } from 'crypto';
import { AuthUserAlreadyRegistered, AuthUserNotExists } from '@/http/auth/auth.errors';
import { TestStateService } from './state.service';

@Injectable()
export class InMemoryAccountsRepository implements AccountsRepository {
  private accounts: Array<{
    accountid: string;
    username: string;
    email: string;
    password: string;
    role?: string;
  }> = [];

  constructor(private readonly state: TestStateService) {}

  async registerAccount(record: IRegisterProps): Promise<void> {
    const exists = this.accounts.find((a) => a.email === record.account.email);
    if (exists) {
      throw new AuthUserAlreadyRegistered();
    }
    const id = record.account.accountId || randomUUID();
    this.accounts.push({
      accountid: id,
      username: record.account.username,
      email: record.account.email,
      password: record.account.password,
      role: 'member',
    });
    this.state.currentAccountId = id;
  }

  async searchAccountByEmail(email: string): Promise<IVerifyUserReponse> {
    const found = this.accounts.find((a) => a.email === email);
    if (!found) {
      throw new AuthUserNotExists();
    }
    return {
      acountid: found.accountid,
      hash: found.password,
      username: found.username,
      role: found.role,
    };
  }

  async searchAccountById(id: string): Promise<IVerifyUserReponse> {
    const found = this.accounts.find((a) => a.accountid === id);
    if (!found) {
      throw new AuthUserNotExists();
    }
    return {
      acountid: found.accountid,
      hash: found.password,
      username: found.username,
      role: found.role,
    };
  }

  async changePasswordFromAccount(accountId: string, newPassword: string): Promise<void> {
    const idx = this.accounts.findIndex((a) => a.accountid === accountId);
    if (idx === -1) throw new Error('account Not Found!');
    this.accounts[idx].password = newPassword;
  }
}

