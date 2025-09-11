import { Module } from '@nestjs/common';
import { AuthModule } from './http/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './http/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { WebhooksController } from './http/webhooks/webhooks.controller';
import { WebhooksService } from './http/webhooks/webhooks.service';
import { ChatController } from './http/chat/chat.controller';
import { ChatService } from './http/chat/chat.service';
import { ChatModule } from './http/chat/chat.module';
import { FunnelController } from './http/funnel/funnel.controller';
import { FunnelService } from './http/funnel/funnel.service';
import { FunnelModule } from './http/funnel/funnel.module';
import { PermissionsGuard } from './http/auth/permissions.guard';
import { HashGeneratorService } from './common/hash/hash-generator.service';
import { RedisService } from './application/database/config/redis.service';
import { RedisRefreshTokensService } from './application/database/redis-refresh-token';
import { EnviromentService } from './application/env/env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_TOKEN'),
        signOptions: { expiresIn: '1h' },
        global: true,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: config.getOrThrow<string>('REDIS_PORT'),
          password: config.getOrThrow<string>('REDIS_PASSWORD'),
          ttl: config.getOrThrow<number>('REDIS_TTL', 3600),
        }),
      }),
    }),
    AuthModule,
    PassportModule,
    ChatModule,
    FunnelModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    WebhooksService,
    ChatService,
    FunnelService,
    HashGeneratorService,
    RedisService,
    RedisRefreshTokensService,
    EnviromentService,
  ],
  controllers: [WebhooksController, ChatController, FunnelController],
  exports: [HashGeneratorService],
})
export class AppModule {}
