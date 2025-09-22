import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { NanoidGeneratorService } from '@/common/identifiers/nanoid-generator.service';
import { Replace } from '@/utility';
import { company_type, contacts, genere, roles_contact } from '@prisma/client';
import { companyTypeEnum } from './company';
import { TagEntity } from './tag';

export class ContactAlreadyExistsError extends Error {
  constructor() {
    super('O contato já esta vinculado a esta conta.');
  }
}

export class ContactNotFoundError extends Error {
  constructor() {
    super('Contato não encontrado.');
  }
}

export class AccountWithoutContactError extends Error {
  constructor() {
    super('Conta não possui contato associado.');
  }
}

export enum ContactGenere {
  masculine = 'masculine',
  feminine = 'feminine',
}

export enum ContactRole {
  client = 'client',
  collaborator = 'collaborator',
}

export type ContactAccount = {
  contact_accounts_id: string;
  contactid: string;
  accountid: string;
  created_at: Date;
};

export interface IContact {
  contactId: string;
  username: string;
  avatar_url: string;
  phone: string;
  email: string;
  document_rg: string;
  document_cpf: string;
  birthday: Date;
  genere: ContactGenere;
  city: string;
  stateUF: string;
  role: ContactRole;
  tags: TagEntity[];
  lead_source?: string | null;
  employeer?: string | null;
  segment?: companyTypeEnum | null;
  company?: string | null;
  funnel_name?: string | null;
}

export interface IContactFrontend {
  id: string;
  name: string;
  email: string;
  phone: string;
  rg: string;
  cpf: string;
  birthday: string;
  gender: string;
  city: string;
  stateUF: string;
  company: string;
  segment: string;
  leadSource: string;
  employee: string;
  avatarUrl?: string;
}

export function convertPrismaToContactEntity(contact: contacts) {
  return new ContactEntity({
    avatar_url: contact.avatar_url,
    username: contact.username,
    phone: contact.phone,
    email: contact.email,
    document_rg: contact.document_rg,
    document_cpf: contact.document_cpf,
    birthday: contact.birthday,
    genere: contact.genere as ContactGenere,
    city: contact.city,
    stateUF: contact.state,
    role: contact.role as ContactRole,
    lead_source: contact.lead_source ?? null,
    tags: [],
    contactId: contact.contactid,
    company: contact.company ?? null,
    segment: (contact.segment as companyTypeEnum) ?? null,
    employeer: contact.employeer ?? null,
  });
}

export class ContactEntity {
  private _self: IContact;
  private _identifiers: IdentifiersGeneratorService;

  constructor(
    contact: Replace<
      IContact,
      {
        contactId?: string;
        genere: ContactGenere | string;
        role?: ContactRole | string;
      }
    >,
  ) {
    this._identifiers = new NanoidGeneratorService();
    this._self = {
      contactId: contact.contactId ?? this._identifiers.generate('contact'),
      username: contact.username,
      avatar_url: contact.avatar_url,
      phone: contact.phone,
      email: contact.email,
      document_rg: contact.document_rg,
      document_cpf: contact.document_cpf,
      birthday: contact.birthday,
      genere: contact.genere as ContactGenere,
      city: contact.city,
      stateUF: contact.stateUF,
      role: (contact.role as ContactRole) ?? ContactRole.client,
      tags: contact.tags ?? [],
      lead_source: contact.lead_source,
      company: contact.company ?? null,
      segment: contact.segment ?? null,
      employeer: contact.employeer ?? null,
      funnel_name: contact.funnel_name ?? null,
    };
  }

  get contactId() {
    return this._self.contactId;
  }

  get username() {
    return this._self.username;
  }

  get avatar() {
    return this._self.avatar_url;
  }

  get phone() {
    return this._self.phone;
  }

  get email() {
    return this._self.email;
  }

  get document_rg() {
    return this._self.document_rg;
  }

  get document_cpf() {
    return this._self.document_cpf;
  }

  get birthday() {
    return this._self.birthday;
  }

  get genere() {
    return this._self.genere;
  }

  get city() {
    return this._self.city;
  }

  get state() {
    return this._self.stateUF;
  }

  get role() {
    return this._self.role;
  }

  get tags() {
    return this._self.tags;
  }

  get leadSource() {
    return this._self.lead_source;
  }

  get company() {
    return this._self.company;
  }

  get segment() {
    return this._self.segment;
  }

  get employeer() {
    return this._self.employeer;
  }

  set tags(tags: TagEntity[]) {
    this._self.tags = tags;
  }

  get funnel_name() {
    return this._self?.funnel_name ?? '';
  }

  set funnel_name(funnel_name: string | null) {
    this._self.funnel_name = funnel_name;
  }

  public toPrisma(): Omit<contacts, 'created_at'> {
    return {
      contactid: this._self.contactId,
      avatar_url: this._self.avatar_url,
      username: this._self.username,
      phone: this._self.phone,
      email: this._self.email,
      document_rg: this._self.document_rg,
      document_cpf: this._self.document_cpf,
      birthday: this._self.birthday,
      genere: this._self.genere as genere,
      city: this._self.city,
      state: this._self.stateUF,
      role: this._self.role as roles_contact,
      lead_source: this._self.lead_source ?? null,
      company: this._self.company ?? null,
      segment: this._self.segment as company_type,
      employeer: this._self.employeer ?? null,
      funnel_name: this._self.funnel_name ?? null,
    };
  }

  public toFrontend() {
    return {
      contactId: this._self.contactId,
      username: this._self.username,
      avatar: this._self.avatar_url,
      phone: this._self.phone,
      email: this._self.email,
      document_rg: this._self.document_rg,
      document_cpf: this._self.document_cpf,
      birthday: this._self.birthday,
      genere: this._self.genere,
      city: this._self.city,
      state: this._self.stateUF,
      role: this._self.role,
      company: this._self.company,
      segment: this._self.segment,
      leadSource: this._self.lead_source,
      employee: this._self.employeer,
      employeeName: this._self.employeer,
      funnel: this._self.funnel_name,
      tags: this._self.tags.map((tag) => tag.toFrontend()),
    };
  }
}
