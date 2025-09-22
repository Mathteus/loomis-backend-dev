import { CreateContact, UpdateContact } from '@/application/dto/contacts';
import {
  AccountWithoutContactError,
  ContactAlreadyExistsError,
  ContactEntity,
  ContactNotFoundError,
} from '@/application/entities/contact';
import {
  ContactsRepository,
  Query,
} from '@/application/repositories/contacts-repository';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export interface IContactDeleteProps {
  accountId?: string;
  contactId: string;
  jwtId: string;
}

export interface IContactUpdateProps {
  accountId: string;
  contactId: string;
  toUpdate: UpdateContact;
  page: number;
}

export interface IContactCreateProps {
  contact: CreateContact;
  accountId: string;
  page: number;
}

export interface IContactRequestProps {
  accountId?: string;
  contactId?: string;
  page: number;
}

export interface IContactFilterProps {
  accountId: string;
  query: Query[];
  page: number;
}

@Injectable()
export class ContactService {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async createContact(props: IContactCreateProps) {
    try {
      const newContact = new ContactEntity({
        avatar_url: props.contact.avatarUrl,
        username: props.contact.name,
        phone: props.contact.phone,
        email: props.contact.email,
        document_rg: props.contact.document_rg,
        document_cpf: props.contact.document_cpf,
        birthday: new Date(props.contact.birthday),
        genere: props.contact.gender,
        city: props.contact.city,
        stateUF: props.contact.stateUF,
        segment: props.contact.segment,
        tags: [],
      });
      const contacts = await this.contactsRepository.createContact({
        newContact,
        accountId: props.accountId,
        page: props.page,
      });
      const tagsCreated = await this.contactsRepository.addTagToContact({
        contactId: newContact.contactId,
        tagIds: props.contact.tags,
      });
      return contacts.map((e) => {
        if (e.contactId === newContact.contactId) {
          e.tags = tagsCreated;
        }
        return e.toFrontend();
      });
    } catch (err) {
      if (err instanceof ContactAlreadyExistsError) {
        throw new ConflictException(err.message);
      }

      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getContactById(contactToFind: IContactRequestProps) {
    try {
      const contact = await this.contactsRepository.getContactById({
        contactId: contactToFind?.contactId ?? '',
        page: contactToFind.page,
      });
      return contact.toFrontend();
    } catch (err) {
      if (err instanceof ContactNotFoundError) {
        throw new NotFoundException(err.message);
      }

      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getContactsByAccount(account: IContactRequestProps) {
    try {
      const contacts = await this.contactsRepository.getContactsByAccount({
        accountId: account?.accountId ?? '',
        page: account.page,
      });
      return contacts.map((e) => {
        return e.toFrontend();
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }

      if (err instanceof AccountWithoutContactError) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async updateContact(contactToUpdate: IContactUpdateProps) {
    try {
      const contacts = await this.contactsRepository.updateContact({
        contactId: contactToUpdate.contactId,
        toUpdate: contactToUpdate.toUpdate,
        accountId: contactToUpdate.accountId,
        page: contactToUpdate.page,
      });
      return contacts.map((e) => {
        return e.toFrontend();
      });
    } catch (err) {
      if (err instanceof ContactNotFoundError) {
        throw new NotFoundException(err.message);
      }

      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async deleteContact(contactToDelete: IContactDeleteProps) {
    try {
      if (contactToDelete?.accountId) {
        await this.contactsRepository.deleteByAccount({
          contactId: contactToDelete.contactId,
          accountId: contactToDelete.accountId,
        });
        return true;
      }
      await this.contactsRepository.deleteContact({
        contactId: contactToDelete.contactId,
        accountId: contactToDelete.jwtId,
      });
      return true;
    } catch (err) {
      if (err instanceof ContactNotFoundError) {
        throw new NotFoundException(err.message);
      }

      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getContactEmployees() {
    try {
      const employees = await this.contactsRepository.getContactEmplooyes();
      return employees.map((e) => {
        return e.toFrontend();
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getContactsByFilter(payload: IContactFilterProps) {
    try {
      const contacts = await this.contactsRepository.getContactsByFilter({
        accountId: payload.accountId,
        query: payload.query,
        page: payload.page,
      });
      return contacts.map((e) => {
        return e.toFrontend();
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }
}
