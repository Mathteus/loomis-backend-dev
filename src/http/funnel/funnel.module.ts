import { Module } from '@nestjs/common';
import { FunnelController } from './funnel.controller';
import { FunnelService } from './funnel.service';
import { PrismaService } from '@/application/database/config/prisma.service';
import { PrismaFunnelRepository } from '@/application/database/prisma-funnel.repository';
import { PrismaPipelineRepository } from '@/application/database/prisma-pipeline.repository';
import { PrismaItemPipeRepository } from '@/application/database/prisma-item-pipe.repository';
import { FunnelRepository } from '@/application/repositories/funnel.repository';
import { PipelineRepository } from '@/application/repositories/pipeline.repository';
import { ItemPipeRepository } from '@/application/repositories/item-pipe.repository';
import { RedisRefreshTokensService } from '@/application/database/redis-refresh-token';
import { RedisService } from '@/application/database/config/redis.service';

@Module({
  providers: [
    PrismaService,
    FunnelService,
    RedisService,
    RedisRefreshTokensService,
    { provide: FunnelRepository, useClass: PrismaFunnelRepository },
    { provide: PipelineRepository, useClass: PrismaPipelineRepository },
    { provide: ItemPipeRepository, useClass: PrismaItemPipeRepository },
  ],
  controllers: [FunnelController],
  exports: [
    FunnelService,
    FunnelRepository,
    PipelineRepository,
    ItemPipeRepository,
  ],
})
export class FunnelModule {}
