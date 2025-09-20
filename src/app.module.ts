import { Module } from '@nestjs/common';
import { AuthModule } from './http/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './http/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { PermissionsGuard } from './http/auth/permissions.guard';
import { HashGeneratorService } from './common/hash/hash-generator.service';
import { RedisService } from './application/database/config/redis.service';
import { RedisRefreshTokensService } from './application/database/redis-refresh-token';
import { EnviromentService } from './application/env/env.service';
import { ContactModule } from './http/contact/contact.module';
import { CheckModule } from './http/check/check.module';
import { MonitorModule } from './http/monitor/monitor.module';
// import { ChatModule } from './http/chat/chat.module';
// import { FunnelModule } from './http/funnel/funnel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_TOKEN'),
        signOptions: { expiresIn: '4h' },
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
          username: config.getOrThrow<string>('REDIS_USERNAME'),
          password: config.getOrThrow<string>('REDIS_PASSWORD'),
          port: config.getOrThrow<string>('REDIS_PORT'),
          ttl: config.getOrThrow<number>('REDIS_TTL', 3600),
          // url: config.getOrThrow<string>('REDIS_URL'),
        }),
      }),
    }),
    // ChatModule,
    // FunnelModule,
    AuthModule,
    PassportModule,
    CheckModule,
    ContactModule,
    MonitorModule,
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
    HashGeneratorService,
    RedisService,
    RedisRefreshTokensService,
    EnviromentService,
  ],
  exports: [HashGeneratorService],
})
export class AppModule {}
