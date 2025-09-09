import { Injectable } from '@nestjs/common';

export interface IContactResponse {
  contactId: string;
  username: string;
  phone: string;
  email: string;
}

export interface IConversationResponse {
  id: string;
  participantAId: string;
  participantBId: string;
  createdAt: Date;
}

export interface IMessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  contentType: string;
  contentData: string;
  timestamp: Date;
}

export interface IQuickMessageResponse {
  id: string;
  accountId: string;
  title?: string | null;
  contentType: string;
  contentData: string;
  createdAt: Date;
}

export interface ICreateMessageRequest {
  senderId: string;
  receiverId: string;
  contentType: string;
  contentData: string;
}

export interface ICreateScheduledMessageRequest {
  senderId: string;
  receiverId: string;
  contentType: string;
  contentData: string;
  scheduleAt: Date;
}

export interface ICreateQuickMessageRequest {
  accountId: string;
  title?: string;
  contentType: string;
  contentData: string;
}

@Injectable()
export abstract class ChatRepository {
  abstract getContactsByAccount(accountId: string): Promise<IContactResponse[]>;
  abstract getConversationsByAccount(
    accountId: string,
  ): Promise<IConversationResponse[]>;
  abstract ensureConversation(
    aId: string,
    bId: string,
  ): Promise<IConversationResponse>;
  abstract createMessage(
    req: ICreateMessageRequest,
  ): Promise<IMessageResponse>;
  abstract getMessagesBetween(
    accountId: string,
    otherId: string,
  ): Promise<IMessageResponse[]>;
  abstract createScheduledMessage(
    req: ICreateScheduledMessageRequest,
  ): Promise<{ id: string }>;
  abstract deleteScheduledMessage(
    scheduledId: string,
  ): Promise<void>;
  abstract createQuickMessage(
    req: ICreateQuickMessageRequest,
  ): Promise<IQuickMessageResponse>;
  abstract getQuickMessages(accountId: string): Promise<IQuickMessageResponse[]>;
}
