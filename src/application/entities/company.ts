import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { NanoidGeneratorService } from '@/common/identifiers/nanoid-generator.service';
import { Replace, validarCNPJ } from '@/utility';
import {
  CompanyCustomers,
  CompanyEmployees,
  CompanyType,
} from '@prisma/client';

export class ErrorCompanyNameLength extends Error {
  constructor() {
    super('Nome da empresa deve ter no minimo 3 caracteres!');
  }
}

export class ErrorCompanyCNPJInvalid extends Error {
  constructor() {
    super('CNPJ da empresa está em formato inválido!');
  }
}

export enum companyTypeEnum {
  DIGITAL_MARKETING_AGENCY = 'DIGITAL_MARKETING_AGENCY',
  SERVICE_COMPANY = 'SERVICE_COMPANY',
  BUSINESS = 'BUSINESS',
  STARTUP = 'STARTUP',
}

export enum companyCustomesEnum {
  '1_10' = '1_10',
  '11_20' = '11_20',
  '21_50' = '21_50',
  '51_100' = '51_100',
  '100+' = '100+',
}

export enum companyEmployeesEnum {
  JUST_ME = 'JUST_ME',
  '1_10' = '1_10',
  '11_20' = '11_20',
  '21_50' = '21_50',
  '51_100' = '51_100',
  '100+' = '100+',
}

export interface ICompany {
  companyId: string;
  companyName: string;
  companyCNPJ: string;
  companyEmplooyes: companyEmployeesEnum;
  companyCustomes: companyCustomesEnum;
  companyType: companyTypeEnum;
}

export class CompanyEntity {
  private _company: ICompany;
  private _idenfier: IdentifiersGeneratorService;

  constructor(
    company: Replace<
      ICompany,
      {
        companyId?: string;
      }
    >,
  ) {
    this.verifyCompanyName(company.companyName);
    this.verifyCompanyCNPJ(company.companyCNPJ);
    this._idenfier = new NanoidGeneratorService();
    this._company = {
      companyId: company.companyId ?? this._idenfier.generate('companies'),
      companyName: company.companyName,
      companyCNPJ: company.companyCNPJ,
      companyEmplooyes: company.companyEmplooyes,
      companyCustomes: company.companyCustomes,
      companyType: company.companyType,
    };
  }

  private verifyCompanyName(name: string) {
    if (name.length < 3) {
      throw new ErrorCompanyNameLength();
    }
  }

  private verifyCompanyCNPJ(document: string) {
    if (!validarCNPJ(document)) {
      throw new ErrorCompanyCNPJInvalid();
    }
  }

  public get companyId(): string {
    return this._company.companyId;
  }

  public get companyName(): string {
    return this._company.companyName;
  }

  public get companyType(): string {
    return this._company.companyType;
  }

  public get companyCustomes(): companyCustomesEnum {
    return this._company.companyCustomes;
  }

  public get companyEmplooyes(): companyEmployeesEnum {
    return this._company.companyEmplooyes;
  }

  public get companyCNPJ(): string {
    return this._company.companyCNPJ;
  }

  public getCustomesString(): CompanyCustomers {
    switch (this.companyCustomes) {
      case companyCustomesEnum['1_10']:
        return 'C1_10';
      case companyCustomesEnum['11_20']:
        return 'C11_20';
      case companyCustomesEnum['21_50']:
        return 'C21_50';
      case companyCustomesEnum['51_100']:
        return 'C51_100';
      case companyCustomesEnum['100+']:
        return 'C100P';
    }
  }

  public getEmployeesString(): CompanyEmployees {
    switch (this.companyEmplooyes) {
      case companyEmployeesEnum.JUST_ME:
        return 'JUST_ME';
      case companyEmployeesEnum['1_10']:
        return 'C1_10';
      case companyEmployeesEnum['11_20']:
        return 'C11_20';
      case companyEmployeesEnum['21_50']:
        return 'C21_50';
      case companyEmployeesEnum['51_100']:
        return 'C51_100';
      case companyEmployeesEnum['100+']:
        return 'C100P';
    }
  }

  public getTypeString(): CompanyType {
    switch (this._company.companyType) {
      case companyTypeEnum.BUSINESS:
        return 'BUSINESS';
      case companyTypeEnum.DIGITAL_MARKETING_AGENCY:
        return 'DIGITAL_MARKETING_AGENCY';
      case companyTypeEnum.SERVICE_COMPANY:
        return 'SERVICE_COMPANY';
      case companyTypeEnum.STARTUP:
        return 'STARTUP';
    }
  }
}
