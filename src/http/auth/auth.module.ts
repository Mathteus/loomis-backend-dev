import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptService } from '@/common/password-hasher/bcrypt.service';
import { PasswordHasherService } from '@/common/password-hasher/password-hasher.service';
import { AccountsRepository } from '@/application/repositories/accounts-repository';
import { PrismaAccountsRepository } from '@/application/database/accounts-repository-prisma';
import { PrismaService } from '@/application/database/config/prisma.service';
import { ResendService } from '@/application/email/resend.service';
import { EmailService } from '@/application/email/email.service';
import { TotpService } from '@/common/code-generator/totp.service';
import { CodeGeneratorService } from '@/common/code-generator/code-generator.service';
import { JwtOwnService } from '@/common/jwt/jwt.service';

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
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
