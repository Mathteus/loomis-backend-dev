import { ContactEntity, IContact } from '../entities/contact';

export type Query = {
  field: string;
  compare: 'equals' | 'not' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'notIn';
  value: unknown;
};

export interface IContactCreate {
  newContact: ContactEntity;
  accountId: string;
  page: number;
}

export interface IContactUpdate {
  accountId: string;
  contactId: string;
  toUpdate: Partial<IContact>;
  page: number;
}

export interface IContactDelete {
  contactId: string;
  accountId: string;
  page: number;
}

export interface IContactFilter {
  accountId: string;
  query: Query[];
  page: number;
}

export interface IContactsRequestAccount {
  accountId: string;
  page: number;
}

export interface IContactsRequest {
  contactId: string;
  page: number;
}

export abstract class ContactsRepository {
  abstract createContact(payload: IContactCreate): Promise<ContactEntity[]>;
  abstract getContactsByAccount(
    contact: IContactsRequestAccount,
  ): Promise<ContactEntity[]>;
  abstract getContactById(contact: IContactsRequest): Promise<ContactEntity>;
  abstract updateContact(contact: IContactUpdate): Promise<ContactEntity[]>;
  abstract deleteContact(contact: IContactDelete): Promise<ContactEntity[]>;
  abstract deleteByAccount(contact: IContactDelete): Promise<ContactEntity[]>;
  abstract getContactEmplooyes(): Promise<ContactEntity[]>;
  abstract getContactsByFilter(
    filters: IContactFilter,
  ): Promise<ContactEntity[]>;
}
