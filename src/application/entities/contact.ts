import { Replace } from '@/utility';
import { randomUUID } from 'node:crypto';

export interface IContact {
  contactId: string;
  username: string;
  collaboratorId: string;
  phone: string;
  email: string;
  document_rg: string;
  document_cpf: string;
  birthday: Date;
  genere: 'F' | 'M';
  city: string;
  state: string;
  companyId: string;
  origin: string;
}

export class ContactEntity {
  _self: IContact;

  constructor(
    contact: Replace<
      IContact,
      {
        contactId?: string;
      }
    >,
  ) {
    this._self = {
      contactId: randomUUID(),
      username: contact.username,
      collaboratorId: contact.collaboratorId,
      phone: contact.phone,
      email: contact.email,
      document_rg: contact.document_rg,
      document_cpf: contact.document_cpf,
      birthday: contact.birthday,
      genere: contact.genere,
      city: contact.city,
      state: contact.state,
      companyId: contact.companyId,
      origin: contact.origin,
    };
  }

  get id() {
    return this._self.contactId;
  }

  get username() {
    return this._self.username;
  }

  get collaboratorId() {
    return this._self.collaboratorId;
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
    return this._self.state;
  }

  get companyId() {
    return this._self.companyId;
  }

  get origin() {
    return this._self.origin;
  }
}
