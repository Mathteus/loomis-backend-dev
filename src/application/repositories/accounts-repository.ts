import { Injectable } from '@nestjs/common';
import { AccountEntity, RoleAccount } from '../entities/account';
import { CompanyEntity } from '../entities/company';

export interface IVerifyUserRequest {
  email: string;
}

export interface IVerifyUserReponse {
  acountid: string;
  hash: string;
  username: string;
  role?: string;
}

export interface IAccount {
  acountid: string;
  username: string;
  email: string;
  password: string;
  role: string;
  companyCompanyid: string;
}

export interface IRegisterProps {
  account: AccountEntity;
  company: CompanyEntity;
}

export type FieldsAccountUpdate = {
  avatar?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: RoleAccount;
};

export interface IUpdateAccountProps {
  accountId: string;
  toUpdate: FieldsAccountUpdate;
}

@Injectable()
export abstract class AccountsRepository {
  abstract registerAccount(record: IRegisterProps): Promise<void>;
  abstract searchAccountByEmail(email: string): Promise<IVerifyUserReponse>;
  abstract searchAccountById(id: string): Promise<IVerifyUserReponse>;
  abstract changePasswordFromAccount(
    accountId: string,
    newPassword: string,
  ): Promise<void>;
  abstract updateAccount(props: IUpdateAccountProps): Promise<void>;
}
