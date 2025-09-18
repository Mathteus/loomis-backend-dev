import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { PrismaContactsRepository } from '@/application/database/prisma-contacts.repository';
import { ContactsRepository } from '@/application/repositories/contacts-repository';
import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { NanoidGeneratorService } from '@/common/identifiers/nanoid-generator.service';
import { PrismaService } from '@/application/database/config/prisma.service';
import { RedisRefreshTokensService } from '@/application/database/redis-refresh-token';
import { RedisService } from '@/application/database/config/redis.service';

@Module({
  controllers: [ContactController],
  providers: [
    {
      provide: ContactsRepository,
      useClass: PrismaContactsRepository,
    },
    {
      provide: IdentifiersGeneratorService,
      useClass: NanoidGeneratorService,
    },
    ContactService,
    NanoidGeneratorService,
    PrismaContactsRepository,
    PrismaService,
    RedisRefreshTokensService,
    RedisService,
  ],
})
export class ContactModule {}
