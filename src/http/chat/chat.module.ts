import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '@/application/database/config/prisma.service';
import { RedisService } from '@/application/database/config/redis.service';
import { ChatRepository } from '@/application/repositories/chat-repository';
import { PrismaChatRepository } from '@/application/database/prisma-chat.repository';

@Module({
  providers: [
    ChatService,
    PrismaService,
    RedisService,
    { provide: ChatRepository, useClass: PrismaChatRepository },
  ],
  controllers: [ChatController],
})
export class ChatModule {}
