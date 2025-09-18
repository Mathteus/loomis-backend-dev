import {
  CompanyCustomesEnum,
  CompanyEmployeesEnum,
  CompanyEntity,
  companyTypeEnum,
  ICompany,
} from './company';
import {
  IAccount,
  RolesType,
  AccountEntity,
  ErrorUsernameMinLength,
  ErrorEmailInvalid,
} from './account';

function MakeCompany(companyOptional: Partial<ICompany> = {}) {
  return new CompanyEntity({
    companyName: companyOptional?.companyName ?? 'Thux',
    companyCNPJ: companyOptional?.companyCNPJ ?? '84.172.252/0001-98',
    companyEmplooyes:
      companyOptional?.companyEmplooyes ?? CompanyEmployeesEnum['21_50'],
    companyCustomes:
      companyOptional?.companyCustomes ?? CompanyCustomesEnum['51_100'],
    companyType: companyOptional?.companyType ?? companyTypeEnum.BUSINESS,
  });
}

function CreateAccount(accountOptional: Partial<IAccount> = {}) {
  return {
    username: accountOptional?.username ?? 'Matheus Henrique',
    password: accountOptional?.password ?? 'A54faf4g4gdsgds4s%#@',
    userrole: accountOptional?.userrole ?? RolesType.client,
    company: accountOptional?.company ?? MakeCompany(),
    email: accountOptional?.email ?? 'Matheus.Henrique@email.com',
  };
}

describe('Company Entity', () => {
  it('should be possible to create a new company without errors', () => {
    expect(() => {
      new AccountEntity(CreateAccount());
    }).toBeTruthy();
  });

  it('shouldnt be possible to create an account with a name with only 2 characters', () => {
    expect(() => {
      new AccountEntity(CreateAccount({ username: 'as' }));
    }).toThrow(expect.any(ErrorUsernameMinLength));
  });

  it('should not be possible to create an account with an invalid email address', () => {
    expect(() => {
      new AccountEntity(CreateAccount({ email: 'email.invalido$email.com' }));
    }).toThrow(expect.any(ErrorEmailInvalid));
  });
});
