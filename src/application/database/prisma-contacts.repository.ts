import { Injectable } from '@nestjs/common';
import {
  ContactsRepository,
  IContactCreate,
  IContactDelete,
  IContactFilter,
  IContactsRequest,
  IContactsRequestAccount,
  IContactUpdate,
} from '../repositories/contacts-repository';
import { PrismaService } from './config/prisma.service';
import {
  AccountWithoutContactError,
  ContactAlreadyExistsError,
  ContactEntity,
  ContactGenere,
  ContactNotFoundError,
  ContactRole,
  IContact,
  IContactAccount,
  ITag,
  convertPrismaToContactEntity,
} from '../entities/contact';
import { company_type, contacts, roles_contact } from '@prisma/client';

@Injectable()
export class PrismaContactsRepository implements ContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyContactNotExists(contactid: string) {
    const contact = await this.prisma.contacts.findFirst({
      where: { contactid },
    });

    if (!contact) {
      throw new ContactNotFoundError();
    }

    return contact;
  }

  private toPage(page: number) {
    return {
      skip: page * 10,
      take: 10,
    };
  }

  async createContact(payload: IContactCreate) {
    const tagsIds: number[] = [];
    for (const tag of payload.newContact.tags) {
      let tagFound = await this.prisma.tags.findFirstOrThrow({
        where: { tagname: tag.title },
      });

      if (!tagFound) {
        tagFound = await this.prisma.tags.create({
          data: {
            tagname: tag.title,
            tagcolor: tag.color,
          },
        });
      }

      tagsIds.push(tagFound.tagid);
    }

    let contact = await this.prisma.contacts.findFirst({
      where: { document_cpf: payload.newContact.document_cpf },
    });

    if (!contact) {
      contact = await this.prisma.contacts.create({
        data: payload.newContact.toPrisma(),
      });
    }

    const relation = await this.prisma.contacts_accounts.findFirst({
      where: { contactid: contact.contactid, accountid: payload.accountId },
    });

    if (relation) {
      throw new ContactAlreadyExistsError();
    }

    await this.prisma.contacts_accounts.create({
      data: { contactid: contact.contactid, accountid: payload.accountId },
    });

    for (const tag of tagsIds) {
      await this.prisma.contacts_tags.create({
        data: { contactid: contact.contactid, tagid: tag },
      });
    }

    return await this.getContactsByAccount({
      accountId: payload.accountId,
      page: payload.page,
    });
  }

  async getContactsByAccount(
    contact: IContactsRequestAccount,
  ): Promise<ContactEntity[]> {
    const linkExists = await this.prisma.contacts_accounts.findFirst({
      where: { accountid: contact.accountId },
    });
    if (!linkExists) {
      throw new AccountWithoutContactError();
    }

    const links = await this.prisma.contacts_accounts.findMany({
      where: { accountid: contact.accountId },
      select: { contactid: true },
    });
    const contactIds = links.map((l: IContactAccount) => l.contactid);

    const contacts = await this.prisma.contacts.findMany({
      where: { contactid: { in: contactIds } },
      orderBy: { username: 'asc' },
      ...this.toPage(contact.page),
    });

    const contactFormatted: ContactEntity[] = contacts.map((c) => {
      const current: IContact = {
        avatar_url: String(c.avatar_url),
        contactId: c.contactid,
        username: c.username,
        phone: c.phone,
        email: c.email,
        document_rg: c.document_rg,
        document_cpf: c.document_cpf,
        birthday: c.birthday,
        genere: c.genere as ContactGenere,
        city: c.city,
        stateUF: c.state,
        role: c.role as ContactRole,
        lead_source: c.lead_source ?? '',
        tags: [],
      };
      return new ContactEntity(current);
    });

    for (const c of contactFormatted) {
      const contactsTag = await this.prisma.contacts_tags.findMany({
        where: { contactid: c.contactId },
      });
      const tags: ITag[] = [];
      for (const tag of contactsTag) {
        const tagFound = await this.prisma.tags.findFirst({
          where: { tagid: tag.tagid },
        });
        tags.push({
          title: tagFound?.tagname as string,
          color: tagFound?.tagcolor as string,
          bgColor: (tagFound?.tagcolor as string) + '33',
        });
      }
      c.tags = tags;
    }

    return contactFormatted;
  }

  async getContactById(contact: IContactsRequest): Promise<ContactEntity> {
    const contactFound = await this.verifyContactNotExists(contact.contactId);
    const contactsTag = await this.prisma.contacts_tags.findMany({
      where: { contactid: contact.contactId },
    });
    const tags: ITag[] = [];
    for (const tag of contactsTag) {
      const tagFound = await this.prisma.tags.findFirst({
        where: { tagid: tag.tagid },
      });
      tags.push({
        title: tagFound?.tagname as string,
        color: tagFound?.tagcolor as string,
        bgColor: (tagFound?.tagcolor as string) + '33',
      });
    }
    const contactFormatted: IContact = {
      avatar_url: String(contactFound.avatar_url),
      contactId: contactFound.contactid,
      username: contactFound.username,
      phone: contactFound.phone,
      email: contactFound.email,
      document_rg: contactFound.document_rg,
      document_cpf: contactFound.document_cpf,
      birthday: contactFound.birthday,
      genere: contactFound.genere as ContactGenere,
      city: contactFound.city,
      stateUF: contactFound.state,
      role: contactFound.role as ContactRole,
      lead_source: contactFound.lead_source ?? '',
      tags: tags ?? [],
    };

    return new ContactEntity(contactFormatted);
  }

  async getContactEmplooyes(): Promise<ContactEntity[]> {
    const employes = await this.prisma.contacts.findMany({
      where: { role: roles_contact.employee },
    });

    return employes.map((e) => {
      return convertPrismaToContactEntity(e);
    });
  }

  private createContactToUpdate(update: Partial<IContact>) {
    const toUpdate: Partial<contacts> = {};

    if (update.avatar_url) {
      toUpdate.avatar_url = update.avatar_url;
    }

    if (update.phone) {
      toUpdate.phone = update.phone;
    }

    if (update.email) {
      toUpdate.email = update.email;
    }

    if (update.document_rg) {
      toUpdate.document_rg = update.document_rg;
    }

    if (update.document_cpf) {
      toUpdate.document_cpf = update.document_cpf;
    }

    if (update.birthday) {
      toUpdate.birthday = update.birthday;
    }

    if (update.genere) {
      toUpdate.genere = update.genere;
    }

    if (update.city) {
      toUpdate.city = update.city;
    }

    if (update.stateUF) {
      toUpdate.state = update.stateUF;
    }

    if (update.role) {
      toUpdate.role = update.role as roles_contact;
    }

    if (update.username) {
      toUpdate.username = update.username;
    }

    if (update.lead_source) {
      toUpdate.lead_source = update.lead_source;
    }

    if (update.segment) {
      toUpdate.segment = (update.segment as company_type) ?? null;
    }

    if (update.company) {
      toUpdate.company = update.company;
    }

    if (update.employeer) {
      toUpdate.employeer = update.employeer;
    }

    if (update.funnel_name) {
      toUpdate.funnel_name = update.funnel_name;
    }
    return toUpdate;
  }

  async updateContact(contact: IContactUpdate): Promise<ContactEntity[]> {
    await this.verifyContactNotExists(contact.contactId);

    const updated = await this.prisma.contacts.update({
      where: { contactid: contact.contactId },
      data: this.createContactToUpdate(contact.toUpdate),
    });

    if (!updated) {
      throw new ContactNotFoundError();
    }

    return this.getContactsByAccount({
      accountId: contact.accountId,
      page: contact.page,
    });
  }

  async deleteContact(contact: IContactDelete) {
    await this.verifyContactNotExists(contact.contactId);
    await this.prisma.$transaction([
      this.prisma.tasks.deleteMany({ where: { clientid: contact.contactId } }),
      this.prisma.tasks.deleteMany({
        where: { collaboratorid: contact.contactId },
      }),
      this.prisma.opportunities.deleteMany({
        where: { contactid: contact.contactId },
      }),
      this.prisma.opportunities.deleteMany({
        where: { colaboratorid: contact.contactId },
      }),
      this.prisma.contacts_accounts.deleteMany({
        where: { contactid: contact.contactId },
      }),
      this.prisma.contacts.delete({ where: { contactid: contact.contactId } }),
    ]);
  }

  async deleteByAccount(contact: IContactDelete) {
    await this.verifyContactNotExists(contact.contactId);

    await this.prisma.$transaction([
      this.prisma.tasks.deleteMany({
        where: {
          clientid: contact.contactId,
          accountid: contact.accountId,
        },
      }),
      this.prisma.opportunities.deleteMany({
        where: {
          contactid: contact.contactId,
          accountid: contact.accountId,
        },
      }),
      this.prisma.contacts_accounts.deleteMany({
        where: { contactid: contact.contactId, accountid: contact.accountId },
      }),
    ]);
  }

  private createFilterPrisma(filters: IContactFilter) {
    if (!filters.query) {
      return;
    }
    const where = {};

    for (const q of filters.query) {
      where[q.field] = {
        [q.compare]: q.value,
      };
    }

    where['accountid'] = {
      equals: filters.accountId,
    };

    return {
      where,
      skip: filters.page * 10,
      take: 10,
    };
  }

  async getContactsByFilter(filters: IContactFilter): Promise<ContactEntity[]> {
    const whereFormatted = this.createFilterPrisma(filters);
    const contacts = await this.prisma.contacts.findMany(whereFormatted);

    return contacts.map((c) => {
      return convertPrismaToContactEntity(c);
    });
  }
}
