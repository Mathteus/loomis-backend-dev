import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptService } from '@/common/password-hasher/bcrypt.service';
import { PasswordHasherService } from '@/common/password-hasher/password-hasher';
import { AccountsRepository } from '@/application/repositories/accounts-repository';
import { PrismaAccountsRepository } from '@/application/database/prisma-accounts-repository';
import { PrismaService } from '@/application/database/config/prisma.service';
import { ResendService } from '@/application/email/resend.service';
import { EmailService } from '@/application/email/email.service';
import { TotpService } from '@/common/code-generator/totp.service';
import { CodeGeneratorService } from '@/common/code-generator/code-generator';
import { JwtOwnService } from '@/common/jwt/jwt.service';
import { RedisRefreshTokensService } from '@/application/database/redis-refresh-token';
import { RefreshTokensRepository } from '@/application/repositories/refreshs-tokens.repository';
import { HashGeneratorService } from '@/common/hash/hash-generator.service';
import { IntentAccountRepository } from '@/application/repositories/intent-account.repository';
import { PrimaAccountIntentService } from '@/application/database/prisma-intent-account';
import { ChatRepository } from '@/application/repositories/chat-repository';
import { PrismaChatRepository } from '@/application/database/prisma-chat.repository';
import { RedisService } from '@/application/database/config/redis.service';
import { FunnelRepository } from '@/application/repositories/funnel.repository';
import { PrismaFunnelRepository } from '@/application/database/prisma-funnel.repository';
import { PipelineRepository } from '@/application/repositories/pipeline.repository';
import { PrismaPipelineRepository } from '@/application/database/prisma-pipeline.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: PasswordHasherService,
      useClass: BcryptService,
    },
    {
      provide: AccountsRepository,
      useClass: PrismaAccountsRepository,
    },
    {
      provide: RefreshTokensRepository,
      useClass: RedisRefreshTokensService,
    },
    {
      provide: IntentAccountRepository,
      useClass: PrimaAccountIntentService,
    },
    {
      provide: EmailService,
      useClass: ResendService,
    },
    {
      provide: CodeGeneratorService,
      useClass: TotpService,
    },
    {
      provide: FunnelRepository,
      useClass: PrismaFunnelRepository,
    },
    {
      provide: PipelineRepository,
      useClass: PrismaPipelineRepository,
    },
    AuthService,
    BcryptService,
    PrismaService,
    ResendService,
    TotpService,
    JwtOwnService,
    HashGeneratorService,
    RedisService,
    RedisRefreshTokensService,
  ],
  controllers: [AuthController],
  exports: [AccountsRepository, RedisRefreshTokensService],
})
export class AuthModule {}
