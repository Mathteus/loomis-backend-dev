import { ContactEntity, IContact } from '../entities/contact';
import { TagEntity } from '../entities/tag';

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
}

export interface IContactFilter {
  accountId: string;
  query: Query[];
  page: number;
}

export interface IContactsAccountProps {
  accountId: string;
  page: number;
}

export interface IContactsProps {
  contactId: string;
  page: number;
}

export interface IContactTagsProps {
  contactId: string;
  tagIds: number[];
}

export abstract class ContactsRepository {
  abstract createContact(payload: IContactCreate): Promise<ContactEntity[]>;
  abstract getContactsByAccount(
    contact: IContactsAccountProps,
  ): Promise<ContactEntity[]>;
  abstract getContactById(contact: IContactsProps): Promise<ContactEntity>;
  abstract updateContact(contact: IContactUpdate): Promise<ContactEntity[]>;
  abstract deleteContact(contact: IContactDelete): Promise<void>;
  abstract deleteByAccount(contact: IContactDelete): Promise<void>;
  abstract getContactEmplooyes(): Promise<ContactEntity[]>;
  abstract getContactsByFilter(
    filters: IContactFilter,
  ): Promise<ContactEntity[]>;
  abstract getTagsByContactId(contactId: string): Promise<TagEntity[]>;
  abstract addTagToContact(tag: IContactTagsProps): Promise<TagEntity[]>;
  abstract removeTagFromContact(tag: IContactTagsProps): Promise<TagEntity[]>;
}
