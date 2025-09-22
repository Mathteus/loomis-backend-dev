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
import { RefreshTokensRepository } from '@/application/repositories/refreshs-tokens.repository';
import { HashGeneratorService } from '@/common/hash/hash-generator.service';
import { PrismaRefreshTokenService } from '@/application/database/prisma-refresh-token';

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
      useClass: PrismaRefreshTokenService,
    },
    {
      provide: EmailService,
      useClass: ResendService,
    },
    {
      provide: CodeGeneratorService,
      useClass: TotpService,
    },
    AuthService,
    BcryptService,
    PrismaService,
    ResendService,
    TotpService,
    JwtOwnService,
    HashGeneratorService,
    PrismaRefreshTokenService,
  ],
  controllers: [AuthController],
  exports: [AccountsRepository, PrismaRefreshTokenService],
})
export class AuthModule {}
