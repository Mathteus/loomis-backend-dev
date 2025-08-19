import {
  companyEmployeesEnum,
  companyCustomesEnum,
  companyTypeEnum,
  ICompany,
  CompanyEntity,
  ErrorCompanyNameLength,
  ErrorCompanyCNPJInvalid,
} from './company';

function MakeCompany(companyOptional: Partial<ICompany> = {}) {
  return {
    companyName: companyOptional?.companyName ?? 'Thux',
    companyCNPJ: companyOptional?.companyCNPJ ?? '84.172.252/0001-98',
    companyEmplooyes:
      companyOptional?.companyEmplooyes ?? companyEmployeesEnum['21_50'],
    companyCustomes:
      companyOptional?.companyCustomes ?? companyCustomesEnum['51_100'],
    companyType: companyOptional?.companyType ?? companyTypeEnum.BUSINESS,
  };
}

describe('Company Entity', () => {
  it('should be possible to create a new company without errors', () => {
    expect(() => {
      new CompanyEntity(MakeCompany());
    }).toBeTruthy();
  });

  it('shouldnt be possible to create a company with just 2 characters in the name', () => {
    expect(() => {
      new CompanyEntity(MakeCompany({ companyName: 'bl' }));
    }).toThrow(expect.any(ErrorCompanyNameLength));
  });

  it('shouldnt be possible to create a company with an invalid CNPJ', () => {
    expect(() => {
      new CompanyEntity(MakeCompany({ companyCNPJ: '88.252.958/0881-88' }));
    }).toThrow(expect.any(ErrorCompanyCNPJInvalid));
  });
});
