import { Injectable } from '@nestjs/common';
import {
  IVerifyUserReponse,
  AccountsRepository,
  IRegisterProps,
  FieldsAccountUpdate,
  IUpdateAccountProps,
} from '../repositories/accounts-repository';
import { PrismaService } from './config/prisma.service';
import {
  AuthUserAlreadyRegistered,
  AuthUserNotExists,
} from '@/http/auth/auth.errors';
import { accounts, roles_account } from '@prisma/client';

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registerAccount(record: IRegisterProps): Promise<void> {
    const existingCompany = await this.prisma.companies.findFirst({
      where: {
        companycnpj: record.company.companyCNPJ,
      },
    });

    const company =
      existingCompany ??
      (await this.prisma.companies.create({
        data: {
          companyid: record.company.companyId,
          companyname: record.company.companyName,
          companycnpj: record.company.companyCNPJ,
          companycustomers: record.company.getCustomesPrima(),
          companyemployees: record.company.getEmployeesPrisma(),
          companytype: record.company.getTypePrisma(),
        },
      }));

    const existingAccount = await this.prisma.accounts.findFirst({
      where: {
        email: record.account.email,
      },
    });

    const account =
      existingAccount ??
      (await this.prisma.accounts.create({
        data: {
          accountid: record.account.accountId,
          username: record.account.username,
          email: record.account.email,
          password: record.account.password,
          role: record.account.getRolePrisma() ?? roles_account.member,
        },
      }));

    const existingLink = await this.prisma.company_accounts.findFirst({
      where: {
        companyid: company.companyid,
        accountid: account.accountid,
      },
    });

    if (existingLink) {
      throw new AuthUserAlreadyRegistered();
    }

    await this.prisma.company_accounts.create({
      data: {
        companyid: company.companyid,
        accountid: account.accountid,
      },
    });
  }

  async searchAccountByEmail(email: string): Promise<IVerifyUserReponse> {
    const response = await this.prisma.accounts.findFirst({
      where: {
        email,
      },
    });

    if (!response) {
      throw new AuthUserNotExists();
    }

    return {
      acountid: String(response?.accountid),
      hash: String(response?.password),
      username: String(response?.username),
      role: String(response?.role),
    };
  }

  async searchAccountById(accountid: string): Promise<IVerifyUserReponse> {
    const response = await this.prisma.accounts.findFirst({
      where: {
        accountid,
      },
    });

    if (!response) {
      throw new AuthUserNotExists();
    }

    return {
      acountid: String(response?.accountid),
      hash: String(response?.password),
      username: String(response?.username),
      role: String(response?.role),
    };
  }

  async changePasswordFromAccount(
    accountId: string,
    newPassword: string,
  ): Promise<void> {
    const response = await this.prisma.accounts.update({
      where: {
        accountid: accountId,
      },
      data: {
        password: newPassword,
      },
    });

    if (!response) {
      throw new Error('account Not Found!');
    }
  }

  public createAccountToUpdate(props: FieldsAccountUpdate): Partial<accounts> {
    const accountToUpdate: Partial<accounts> = {};

    if (props.avatar) {
      accountToUpdate.avatar_url = props.avatar;
    }

    if (props.email) {
      accountToUpdate.email = props.email;
    }

    if (props.username) {
      accountToUpdate.username = props.username;
    }

    if (props.password) {
      accountToUpdate.password = props.password;
    }

    if (props.role) {
      accountToUpdate.role = props.role;
    }

    return accountToUpdate;
  }

  async updateAccount(props: IUpdateAccountProps) {
    const user = await this.searchAccountById(props.accountId);

    if (!user) {
      throw new AuthUserNotExists();
    }

    await this.prisma.accounts.update({
      where: {
        accountid: props.accountId,
      },
      data: this.createAccountToUpdate(props.toUpdate),
    });
  }
}
