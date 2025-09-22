import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  IsUUID,
  Length,
} from 'class-validator';
import { ContactGenere, ContactRole } from '../entities/contact';
import { companyTypeEnum } from '../entities/company';
import { Query } from '../repositories/contacts-repository';

export class GetContactByAccountDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;
}

export class CreateContact {
  @IsUrl()
  @IsNotEmpty()
  avatarUrl: string;

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  document_rg: string;

  @IsNumber()
  @IsNotEmpty()
  document_cpf: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: string;

  @IsEnum(ContactGenere)
  @IsNotEmpty()
  gender: ContactGenere;

  @IsEnum(ContactRole)
  @IsNotEmpty()
  role: ContactRole;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  stateUF: string;

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  company: string;

  @IsEnum(companyTypeEnum)
  @IsNotEmpty()
  segment: companyTypeEnum;

  @IsString()
  @IsNotEmpty()
  leadSource: string;

  @IsUUID()
  @IsNotEmpty()
  collaboratorId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  tags: number[];

  @IsString()
  @IsOptional()
  funnel_name: string;
}

export class UpdateContact {
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @Length(3, 50)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  stateUF?: string;
}

export class DeleteContact {
  @IsUUID()
  @IsOptional()
  accountId?: string;
}

export class GetContactsByFilterDto {
  @IsArray()
  @IsNotEmpty()
  query: Query[];
}
