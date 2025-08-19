import { Module } from '@nestjs/common';
import { AuthModule } from './http/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './http/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { PaymentsController } from './http/payments/payments.controller';
import { PaymentsService } from './http/payments/payments.service';
import { PaymentsModule } from './http/payments/payments.module';
import { WebhooksController } from './http/webhooks/webhooks.controller';
import { WebhooksService } from './http/webhooks/webhooks.service';

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
    PaymentsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    PaymentsService,
    WebhooksService,
  ],
  controllers: [PaymentsController, WebhooksController],
})
export class AppModule {}
