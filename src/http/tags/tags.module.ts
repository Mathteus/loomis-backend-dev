import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { PrismaService } from '@/application/database/config/prisma.service';
import { TagsService } from './tags.service';
import { TagsRepository } from '@/application/repositories/tags-repository';
import { PrismaTagsRepository } from '@/application/database/prisma-tags.repository';
import { PrismaRefreshTokenService } from '@/application/database/prisma-refresh-token';

@Module({
  controllers: [TagsController],
  providers: [
    {
      provide: TagsRepository,
      useClass: PrismaTagsRepository,
    },
    TagsService,
    PrismaService,
    PrismaTagsRepository,
    PrismaRefreshTokenService,
  ],
})
export class TagsModule {}
