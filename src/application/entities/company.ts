import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { NanoidGeneratorService } from '@/common/identifiers/nanoid-generator.service';
import { Replace, validarCNPJ } from '@/utility';
import {
  company_customers,
  company_employees,
  company_type,
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

export enum CompanyCustomesEnum {
  '1_10' = '1_10',
  '11_20' = '11_20',
  '21_50' = '21_50',
  '51_100' = '51_100',
  '100+' = '100+',
}

export enum CompanyEmployeesEnum {
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
  companyEmplooyes: CompanyEmployeesEnum;
  companyCustomes: CompanyCustomesEnum;
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

  public get companyCustomes(): CompanyCustomesEnum {
    return this._company.companyCustomes;
  }

  public get companyEmplooyes(): CompanyEmployeesEnum {
    return this._company.companyEmplooyes;
  }

  public get companyCNPJ(): string {
    return this._company.companyCNPJ;
  }

  public getCustomesPrima(): company_customers {
    switch (this.companyCustomes) {
      case CompanyCustomesEnum['1_10']:
        return company_customers.C1_10;
      case CompanyCustomesEnum['11_20']:
        return company_customers.C11_20;
      case CompanyCustomesEnum['21_50']:
        return company_customers.C21_50;
      case CompanyCustomesEnum['51_100']:
        return company_customers.C51_100;
      case CompanyCustomesEnum['100+']:
        return company_customers.C100P;
    }
  }

  public getEmployeesPrisma(): company_employees {
    switch (this.companyEmplooyes) {
      case CompanyEmployeesEnum.JUST_ME:
        return company_employees.JUST_ME;
      case CompanyEmployeesEnum['1_10']:
        return company_employees.E1_10;
      case CompanyEmployeesEnum['11_20']:
        return company_employees.E11_20;
      case CompanyEmployeesEnum['21_50']:
        return company_employees.E21_50;
      case CompanyEmployeesEnum['51_100']:
        return company_employees.E51_100;
      case CompanyEmployeesEnum['100+']:
        return company_employees.E100P;
    }
  }

  public getTypePrisma(): company_type {
    switch (this._company.companyType) {
      case companyTypeEnum.BUSINESS:
        return company_type.BUSINESS;
      case companyTypeEnum.DIGITAL_MARKETING_AGENCY:
        return company_type.DIGITAL_MARKETING_AGENCY;
      case companyTypeEnum.SERVICE_COMPANY:
        return company_type.SERVICE_COMPANY;
      case companyTypeEnum.STARTUP:
        return company_type.STARTUP;
    }
  }
}
