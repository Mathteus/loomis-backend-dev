import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../entities/account';

export interface IVerifyUserRequest {
  email: string;
}

export interface IVerifyUserReponse {
  acountid: string;
  hash: string;
  username: string;
}

export interface IAccount {
  acountid: string;
  username: string;
  email: string;
  password: string;
  role: string;
  companyCompanyid: string;
}

@Injectable()
export abstract class AccountsRepository {
  abstract registerAccount(newUser: AccountEntity): Promise<void>;

  abstract searchAccountByEmail(email: string): Promise<IVerifyUserReponse>;

  abstract searchAccountById(id: string): Promise<IVerifyUserReponse>;

  abstract getAllAccounts(): Promise<Array<IAccount>>;
  abstract changePasswordFromAccount(
    accountId: string,
    newPassword: string,
  ): Promise<void>;
}
