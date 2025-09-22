import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { PrismaService } from '@/application/database/config/prisma.service';
import { TagsService } from './tags.service';
import { TagsRepository } from '@/application/repositories/tags-repository';
import { PrismaTagsRepository } from '@/application/database/prisma-tags.repository';

@Module({
  controllers: [TagsController],
  providers: [
    {
      provide: TagsRepository,
      useClass: PrismaTagsRepository,
    },
    PrismaTagsRepository,
    PrismaService,
    TagsService,
  ],
})
export class TagsModule {}
