import {
  IsArray,
  IsEmail,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  CompanyCustomesEnum,
  CompanyEmployeesEnum,
  companyTypeEnum,
} from '../entities/company';
import { IsCNPJ } from '@/decorators/is-cnpj.decorator';

export class AccountSignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class AccountRefreshToken {
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}

export class AccountForgetPassword {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  code: string;
}

export class AccountSingUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  companyname: string;

  @IsString()
  @IsNotEmpty()
  @IsCNPJ()
  companyCNPJ: string;

  @IsEnum(companyTypeEnum)
  @IsNotEmpty()
  companyType: companyTypeEnum;

  @IsEnum(CompanyCustomesEnum)
  @IsNotEmpty()
  companyCustomers: CompanyCustomesEnum;

  @IsEnum(CompanyEmployeesEnum)
  @IsNotEmpty()
  companyEmployees: CompanyEmployeesEnum;

  @IsArray()
  @IsOptional()
  @IsEmail(
    {},
    { each: true, message: 'A lista de emails deve conteer emails válidos!' },
  )
  emailsInvite: Array<string>;
}
