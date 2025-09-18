// import { Module } from '@nestjs/common';
// import { ChatService } from './chat.service';
// import { ChatController } from './chat.controller';
// import { PrismaService } from '@/application/database/config/prisma.service';
// import { RedisService } from '@/application/database/config/redis.service';
// import { ChatRepository } from '@/application/repositories/chat-repository';
// import { PrismaChatRepository } from '@/application/database/prisma-chat.repository';
// import { RedisRefreshTokensService } from '@/application/database/redis-refresh-token';
// import { ContactsRepository } from '@/application/repositories/contacts-repository';
// import { PrismaContactsRepository } from '@/application/database/prisma-contacts.repository';

// @Module({
//   providers: [
//     ChatService,
//     PrismaService,
//     RedisService,
//     RedisRefreshTokensService,
//     { provide: ChatRepository, useClass: PrismaChatRepository },
//     { provide: ContactsRepository, useClass: PrismaContactsRepository },
//   ],
//   controllers: [ChatController],
//   exports: [ChatService, ChatRepository],
// })
// export class ChatModule {}
