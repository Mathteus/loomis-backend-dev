import {
  IsArray,
  IsEmail,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  MinLength,
} from 'class-validator';
import {
  companyCustomesEnum,
  companyEmployeesEnum,
  companyTypeEnum,
} from '../entities/company';
import { IsCNPJ } from '@/decorators/is-cnpj.decorator';
import { PaymentPlanIntent } from '../entities/intent-account';

export class AccountSignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
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

  @IsStrongPassword()
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

  @IsEnum(companyCustomesEnum)
  @IsNotEmpty()
  companyCustomers: companyCustomesEnum;

  @IsEnum(companyEmployeesEnum)
  @IsNotEmpty()
  companyEmployees: companyEmployeesEnum;

  @IsArray()
  @IsOptional()
  @IsEmail(
    {},
    { each: true, message: 'A lista de emails deve conteer emails válidos!' },
  )
  emailsInvite: Array<string>;
}

export class AccountIntent {
  @IsUUID()
  @IsNotEmpty()
  paymentId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(PaymentPlanIntent)
  @IsNotEmpty()
  paymentPlan: string;
}
