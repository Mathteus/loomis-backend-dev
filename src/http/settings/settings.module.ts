import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '@/application/database/config/prisma.service';
import { PrismaTagsRepository } from '@/application/database/prisma-tags.repository';
import { TagsRepository } from '@/application/repositories/tags-repository';

@Module({
  controllers: [SettingsModule],
  providers: [
    {
      provide: TagsRepository,
      useClass: PrismaTagsRepository,
    },
    SettingsModule,
    AuthService,
    PrismaService,
  ],
})
export class SettingsModule {}
