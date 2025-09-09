import { Injectable } from '@nestjs/common';
import { RedisService } from '@/application/database/config/redis.service';
import {
  ChatRepository,
  ICreateMessageRequest,
  ICreateQuickMessageRequest,
  ICreateScheduledMessageRequest,
} from '@/application/repositories/chat-repository';
import { MessageEntity } from '@/application/entities/message';

@Injectable()
export class ChatService {
  constructor(
    private readonly repo: ChatRepository,
    private readonly cache: RedisService,
  ) {}

  private cacheKey(prefix: string, id: string) {
    return `${prefix}:${id}`;
  }

  public async getContacts(accountId: string) {
    const key = this.cacheKey('contacts', accountId);
    const cached = await this.cache.get(key);
    if (cached) return JSON.parse(String(cached));
    const data = await this.repo.getContactsByAccount(accountId);
    await this.cache.set(key, JSON.stringify(data), 'EX', 60);
    return data;
  }

  public async getConversations(accountId: string) {
    const key = this.cacheKey('conversations', accountId);
    const cached = await this.cache.get(key);
    if (cached) return JSON.parse(String(cached));
    const data = await this.repo.getConversationsByAccount(accountId);
    await this.cache.set(key, JSON.stringify(data), 'EX', 30);
    return data;
  }

  public async sendMessage(req: ICreateMessageRequest) {
    // Basic validation using MessageEntity
    // For non-text content, assume URLs as string (size not enforced here)
    const entity = new MessageEntity({
      contentData: req.contentData,
      contentType: req.contentType as any,
      senderId: req.senderId,
      receiverId: req.receiverId,
      timestamp: new Date(),
    });
    const created = await this.repo.createMessage({
      senderId: entity.senderId,
      receiverId: entity.receiverId,
      contentType: entity.contentType,
      contentData: String(entity.contentData),
    });
    // Invalidate conversation cache
    await this.cache.del(this.cacheKey('conversations', req.senderId));
    await this.cache.del(this.cacheKey('conversations', req.receiverId));
    return created;
  }

  public async getMessagesBetween(userId: string, otherId: string) {
    const key = this.cacheKey('messages', `${userId}:${otherId}`);
    const cached = await this.cache.get(key);
    if (cached) return JSON.parse(String(cached));
    const data = await this.repo.getMessagesBetween(userId, otherId);
    await this.cache.set(key, JSON.stringify(data), 'EX', 15);
    return data;
  }

  public async createScheduledMessage(req: ICreateScheduledMessageRequest) {
    const created = await this.repo.createScheduledMessage(req);
    return created;
  }

  public async deleteScheduledMessage(id: string) {
    await this.repo.deleteScheduledMessage(id);
  }

  public async createQuickMessage(req: ICreateQuickMessageRequest) {
    const created = await this.repo.createQuickMessage(req);
    await this.cache.del(this.cacheKey('quick', req.accountId));
    return created;
  }

  public async getQuickMessages(accountId: string) {
    const key = this.cacheKey('quick', accountId);
    const cached = await this.cache.get(key);
    if (cached) return JSON.parse(String(cached));
    const items = await this.repo.getQuickMessages(accountId);
    await this.cache.set(key, JSON.stringify(items), 'EX', 60);
    return items;
  }
}
