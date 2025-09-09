import { Injectable } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import {
  ChatRepository,
  IContactResponse,
  IConversationResponse,
  ICreateMessageRequest,
  IMessageResponse,
  ICreateScheduledMessageRequest,
  IQuickMessageResponse,
  ICreateQuickMessageRequest,
} from '@/application/repositories/chat-repository';

@Injectable()
export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getContactsByAccount(accountId: string): Promise<IContactResponse[]> {
    // Get account to access its company id
    const account = await this.prisma.accounts.findUnique({
      where: { acountid: accountId },
    });
    if (!account) return [];

    const contacts = await this.prisma.contact.findMany({
      where: { companyId: account.companyCompanyid },
      select: {
        contactId: true,
        username: true,
        phone: true,
        email: true,
      },
      orderBy: { username: 'asc' },
    });
    return contacts as IContactResponse[];
  }

  async getConversationsByAccount(
    accountId: string,
  ): Promise<IConversationResponse[]> {
    const convos = await this.prisma.conversation.findMany({
      where: {
        OR: [{ participantAId: accountId }, { participantBId: accountId }],
      },
      orderBy: { createdAt: 'desc' },
    });
    return convos as unknown as IConversationResponse[];
  }

  private sortPair(a: string, b: string) {
    return a <= b ? [a, b] : [b, a];
  }

  async ensureConversation(
    aId: string,
    bId: string,
  ): Promise<IConversationResponse> {
    const [A, B] = this.sortPair(aId, bId);
    const found = await this.prisma.conversation.findUnique({
      where: { participantAId_participantBId: { participantAId: A, participantBId: B } },
    });
    if (found) return found as unknown as IConversationResponse;

    const created = await this.prisma.conversation.create({
      data: { participantAId: A, participantBId: B },
    });
    return created as unknown as IConversationResponse;
  }

  async createMessage(req: ICreateMessageRequest): Promise<IMessageResponse> {
    const convo = await this.ensureConversation(req.senderId, req.receiverId);
    const msg = await this.prisma.message.create({
      data: {
        conversationId: convo.id,
        senderId: req.senderId,
        receiverId: req.receiverId,
        contentType: req.contentType as any,
        contentData: req.contentData,
      },
    });
    return msg as unknown as IMessageResponse;
  }

  async getMessagesBetween(
    accountId: string,
    otherId: string,
  ): Promise<IMessageResponse[]> {
    const convo = await this.ensureConversation(accountId, otherId);
    const messages = await this.prisma.message.findMany({
      where: { conversationId: convo.id },
      orderBy: { timestamp: 'asc' },
    });
    return messages as unknown as IMessageResponse[];
  }

  async createScheduledMessage(
    req: ICreateScheduledMessageRequest,
  ): Promise<{ id: string }> {
    const created = await this.prisma.scheduledMessage.create({
      data: {
        senderId: req.senderId,
        receiverId: req.receiverId,
        contentType: req.contentType as any,
        contentData: req.contentData,
        scheduleAt: req.scheduleAt,
      },
      select: { id: true },
    });
    return created;
  }

  async deleteScheduledMessage(scheduledId: string): Promise<void> {
    await this.prisma.scheduledMessage.delete({ where: { id: scheduledId } });
  }

  async createQuickMessage(
    req: ICreateQuickMessageRequest,
  ): Promise<IQuickMessageResponse> {
    const created = await this.prisma.quickMessage.create({
      data: {
        accountId: req.accountId,
        title: req.title,
        contentType: req.contentType as any,
        contentData: req.contentData,
      },
    });
    return created as unknown as IQuickMessageResponse;
  }

  async getQuickMessages(accountId: string): Promise<IQuickMessageResponse[]> {
    const items = await this.prisma.quickMessage.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });
    return items as unknown as IQuickMessageResponse[];
  }
}

