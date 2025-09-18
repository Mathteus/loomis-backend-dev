// import { Injectable } from '@nestjs/common';
// import { RedisService } from '@/application/database/config/redis.service';
// import {
//   ChatRepository,
//   ICreateMessageRequest,
//   ICreateQuickMessageRequest,
//   ICreateScheduledMessageRequest,
// } from '@/application/repositories/chat-repository';
// import { MessageEntity } from '@/application/entities/message';
// import {
//   ContactsRepository,
//   IContactRecord,
// } from '@/application/repositories/contacts-repository';
// import { ContactEntity } from '@/application/entities/contact';

// @Injectable()
// export class ChatService {
//   constructor(
//     private readonly repo: ChatRepository,
//     private readonly cache: RedisService,
//     private readonly contactsRepo: ContactsRepository,
//   ) {}

//   private cacheKey(prefix: string, id: string) {
//     return `${prefix}:${id}`;
//   }

//   public async getContacts(accountId: string) {
//     const key = this.cacheKey('contacts', accountId);
//     const cached = await this.cache.get(key);
//     if (cached) return JSON.parse(String(cached));
//     const data = await this.repo.getContactsByAccount(accountId);
//     await this.cache.set(key, JSON.stringify(data), 'EX', 60);
//     return data;
//   }

//   public async getConversations(accountId: string) {
//     const key = this.cacheKey('conversations', accountId);
//     const cached = await this.cache.get(key);
//     if (cached) return JSON.parse(String(cached));
//     const data = await this.repo.getConversationsByAccount(accountId);
//     await this.cache.set(key, JSON.stringify(data), 'EX', 30);
//     return data;
//   }

//   public async sendMessage(req: ICreateMessageRequest) {
//     // Basic validation using MessageEntity
//     // For non-text content, assume URLs as string (size not enforced here)
//     const entity = new MessageEntity({
//       contentData: req.contentData,
//       contentType: req.contentType as any,
//       senderId: req.senderId,
//       receiverId: req.receiverId,
//       timestamp: new Date(),
//     });
//     const created = await this.repo.createMessage({
//       senderId: entity.senderId,
//       receiverId: entity.receiverId,
//       contentType: entity.contentType,
//       contentData: String(entity.contentData),
//     });
//     // Invalidate conversation cache
//     await this.cache.del(this.cacheKey('conversations', req.senderId));
//     await this.cache.del(this.cacheKey('conversations', req.receiverId));
//     return created;
//   }

//   public async getMessagesBetween(userId: string, otherId: string) {
//     const key = this.cacheKey('messages', `${userId}:${otherId}`);
//     const cached = await this.cache.get(key);
//     if (cached) return JSON.parse(String(cached));
//     const data = await this.repo.getMessagesBetween(userId, otherId);
//     await this.cache.set(key, JSON.stringify(data), 'EX', 15);
//     return data;
//   }

//   public async createScheduledMessage(req: ICreateScheduledMessageRequest) {
//     const created = await this.repo.createScheduledMessage(req);
//     return created;
//   }

//   public async deleteScheduledMessage(id: string) {
//     await this.repo.deleteScheduledMessage(id);
//   }

//   public async createQuickMessage(req: ICreateQuickMessageRequest) {
//     const created = await this.repo.createQuickMessage(req);
//     await this.cache.del(this.cacheKey('quick', req.accountId));
//     return created;
//   }

//   public async getQuickMessages(accountId: string) {
//     const key = this.cacheKey('quick', accountId);
//     const cached = await this.cache.get(key);
//     if (cached) return JSON.parse(String(cached));
//     const items = await this.repo.getQuickMessages(accountId);
//     await this.cache.set(key, JSON.stringify(items), 'EX', 60);
//     return items;
//   }

//   // Contacts Management
//   public async createContact(payload: {
//     accountId: string;
//     username: string;
//     avatar?: string;
//     phone: string;
//     email: string;
//     document_rg: string;
//     document_cpf: string;
//     birthday: string | Date;
//     genere: 'MASCULINE' | 'FEMININE';
//     city: string;
//     state: string;
//     role?: 'CLIENT' | 'COLLABORATOR';
//   }): Promise<void> {
//     const entity = new ContactEntity({
//       username: payload.username,
//       avatar: payload.avatar ?? '',
//       phone: payload.phone,
//       email: payload.email,
//       document_rg: payload.document_rg,
//       document_cpf: payload.document_cpf,
//       birthday: new Date(payload.birthday),
//       genere: payload.genere,
//       city: payload.city,
//       stateUF: payload.state,
//       role: payload.role ?? 'CLIENT',
//     });
//     await this.contactsRepo.createContact({
//       contact: entity,
//       account: payload.accountId,
//     });
//     // Invalidate cached simple contacts list
//     await this.cache.del(this.cacheKey('contacts', payload.accountId));
//   }

//   public async updateContact(
//     contactId: string,
//     payload: {
//       username: string;
//       avatar?: string;
//       phone: string;
//       email: string;
//       document_rg: string;
//       document_cpf: string;
//       birthday: string | Date;
//       genere: 'MASCULINE' | 'FEMININE';
//       city: string;
//       state: string;
//       role?: 'CLIENT' | 'COLLABORATOR';
//     },
//   ): Promise<IContactRecord> {
//     const entity = new ContactEntity({
//       contactId,
//       username: payload.username,
//       avatar: payload.avatar ?? '',
//       phone: payload.phone,
//       email: payload.email,
//       document_rg: payload.document_rg,
//       document_cpf: payload.document_cpf,
//       birthday: new Date(payload.birthday),
//       genere: payload.genere,
//       city: payload.city,
//       stateUF: payload.state,
//       role: payload.role ?? 'CLIENT',
//     });
//     const updated = await this.contactsRepo.updateContact(entity);
//     return updated;
//   }

//   public async deleteContact(contactId: string): Promise<void> {
//     await this.contactsRepo.deleteContact(contactId);
//   }

//   public async getContactsRecordsByAccount(
//     accountId: string,
//   ): Promise<IContactRecord[]> {
//     return this.contactsRepo.getContactsByAccount(accountId);
//   }

//   public async getContactById(contactId: string): Promise<IContactRecord> {
//     return this.contactsRepo.getContactById(contactId);
//   }

//   public async filterContactsByAccount(
//     accountId: string,
//     q?: string,
//   ): Promise<IContactRecord[]> {
//     const items = await this.contactsRepo.getContactsByAccount(accountId);
//     if (!q) return items;
//     const query = q.toLowerCase();
//     return items.filter((c) =>
//       [
//         c.username,
//         c.email,
//         c.phone,
//         c.document_cpf,
//         c.document_rg,
//         c.city,
//         c.state,
//         c.role,
//       ]
//         .filter(Boolean)
//         .some((v) => String(v).toLowerCase().includes(query)),
//     );
//   }
// }
