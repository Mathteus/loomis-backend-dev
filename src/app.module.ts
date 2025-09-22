import { Module } from '@nestjs/common';
import { AuthModule } from './http/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './http/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { PermissionsGuard } from './http/auth/permissions.guard';
import { HashGeneratorService } from './common/hash/hash-generator.service';
import { EnviromentService } from './application/env/env.service';
import { ContactModule } from './http/contact/contact.module';
import { CheckModule } from './http/check/check.module';
import { MonitorModule } from './http/monitor/monitor.module';
import { TagsModule } from './http/tags/tags.module';
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
    // ChatModule,
    // FunnelModule,
    AuthModule,
    PassportModule,
    CheckModule,
    ContactModule,
    MonitorModule,
    TagsModule,
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
    EnviromentService,
  ],
  exports: [HashGeneratorService],
})
export class AppModule {}
