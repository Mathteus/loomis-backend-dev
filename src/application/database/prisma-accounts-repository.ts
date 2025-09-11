import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../entities/account';
import {
  IAccount,
  IVerifyUserReponse,
  AccountsRepository,
} from '../repositories/accounts-repository';
import { PrismaService } from './config/prisma.service';
import { AuthUserNotExists } from '@/http/auth/auth.errors';
import { AccountRoles } from '@prisma/client';

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registerAccount(newUser: AccountEntity): Promise<void> {
    const response = await this.prisma.company.create({
      data: {
        companyid: newUser.company.companyId,
        companyname: newUser.company.companyName,
        companycnpj: newUser.company.companyCNPJ,
        companycustomers: newUser.company.getCustomesString(),
        companyemployees: newUser.company.getEmployeesString(),
        companytype: newUser.company.getTypeString(),
      },
    });

    await this.prisma.accounts.create({
      data: {
        acountid: newUser.accountId,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: AccountRoles.CLIENT,
        companyCompanyid: response.companyid,
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
      acountid: String(response?.acountid),
      hash: String(response?.password),
      username: String(response?.username),
      role: String(response?.role),
    };
  }

  async searchAccountById(acountid: string): Promise<IVerifyUserReponse> {
    const response = await this.prisma.accounts.findFirst({
      where: {
        acountid,
      },
    });

    if (!response) {
      throw new AuthUserNotExists();
    }

    return {
      acountid: String(response?.acountid),
      hash: String(response?.password),
      username: String(response?.username),
      role: String(response?.role),
    };
  }

  async getAllAccounts(): Promise<Array<IAccount>> {
    return await this.prisma.accounts.findMany();
  }

  async changePasswordFromAccount(
    accountId: string,
    newPassword: string,
  ): Promise<void> {
    const response = await this.prisma.accounts.update({
      where: {
        acountid: accountId,
      },
      data: {
        password: newPassword,
      },
    });

    if (!response) {
      throw new Error('account Not Found!');
    }
  }
}
