import { CompanyEntity } from './company';
import { isEmailValido, Replace } from '@/utility';
import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { NanoidGeneratorService } from '@/common/identifiers/nanoid-generator.service';

export class ErrorUsernameMinLength extends Error {
  constructor() {
    super('Nome deve ter no minimo 3 caracteres!');
  }
}

export class ErrorPasswordLength extends Error {
  constructor() {
    super('Senha deve ter no minimo 8 caracteres!');
  }
}

export class ErrorEmailInvalid extends Error {
  constructor() {
    super('Email está em formato inválido!');
  }
}

export interface IAccount {
  accountId: string;
  username: string;
  password: string;
  company: CompanyEntity;
  email: string;
  contactId: string[];
  lastPayment?: Date;
  createAt: Date;
}

export class AccountEntity {
  private _accoount: IAccount;
  private _idenfier: IdentifiersGeneratorService;

  constructor(
    account: Replace<
      IAccount,
      {
        accountId?: string;
        contactId?: string[];
        lastPayment?: Date;
        createAt?: Date;
      }
    >,
  ) {
    this.verifyUsername(account.username);
    this.verifyPassword(account.password);
    this.verifyEmail(account.email);
    this._idenfier = new NanoidGeneratorService();
    this._accoount = {
      accountId: account.accountId ?? this._idenfier.generate('accounts'),
      username: account.username,
      password: account.password,
      company: account.company,
      email: account.email,
      contactId: account.contactId ?? [],
      lastPayment: account.lastPayment,
      createAt: account.createAt ?? new Date(),
    };
  }

  private verifyUsername(username: string) {
    if (username.length < 3) {
      throw new ErrorUsernameMinLength();
    }
  }

  private verifyPassword(password: string) {
    if (password.length < 8) {
      throw new ErrorPasswordLength();
    }
  }

  private verifyEmail(email: string) {
    if (!isEmailValido(email)) {
      throw new ErrorEmailInvalid();
    }
  }

  public get accountId(): string {
    return this._accoount.accountId;
  }

  public get username(): string {
    return this._accoount.username;
  }

  public get password(): string {
    return this._accoount.password;
  }

  public get company(): CompanyEntity {
    return this._accoount.company;
  }

  public get contactId(): string[] {
    return this._accoount.contactId;
  }

  public get lastPayment(): Date | undefined {
    return this._accoount.lastPayment;
  }

  public get createAt(): Date {
    return this._accoount.createAt;
  }

  public get email(): string {
    return this._accoount.email;
  }

  public toString() {
    const preFormatt = {
      username: this._accoount.username,
      password: this._accoount.password,
      company: this._accoount.company.toString(),
    };
    return JSON.stringify(preFormatt);
  }
}
