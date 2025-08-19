import { Roles } from '@prisma/client';
import { CompanyEntity } from './company';
import { isEmailValido } from '@/utility';

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

export enum RolesType {
  client = 'CLIENT',
  admin = 'ADMIN',
}

export interface IAccount {
  username: string;
  password: string;
  userrole: RolesType;
  company: CompanyEntity;
  email: string;
}

export class AccountEntity {
  private _accoount: IAccount;

  constructor(account: IAccount) {
    this.verifyUsername(account.username);
    this.verifyPassword(account.password);
    this.verifyEmail(account.email);
    this._accoount = account;
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

  public get username(): string {
    return this._accoount.username;
  }

  public get password(): string {
    return this._accoount.password;
  }

  public get company(): CompanyEntity {
    return this._accoount.company;
  }

  public get userrole(): RolesType {
    return this._accoount.userrole;
  }

  public get email(): string {
    return this._accoount.email;
  }

  public getRoleString(): Roles {
    switch (this._accoount.userrole) {
      case RolesType.admin:
        return RolesType.admin;
      case RolesType.client:
        return Roles.CLIENT;
    }
  }

  public toString() {
    const preFormatt = {
      username: this._accoount.username,
      password: this._accoount.password,
      userrole: JSON.stringify(this._accoount.userrole),
      company: this._accoount.company.toString(),
    };
    return JSON.stringify(preFormatt);
  }
}
