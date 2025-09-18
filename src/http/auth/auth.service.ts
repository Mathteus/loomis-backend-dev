import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccountForgetPassword,
  AccountSignInDto,
  AccountSingUpDto,
} from '@/application/dto/account';
import { AccountsRepository } from '@/application/repositories/accounts-repository';
import { AccountEntity } from '@/application/entities/account';
import { CompanyEntity } from '@/application/entities/company';
import {
  AuthRecoveryCodeWrong,
  AuthUserAlreadyRegistered,
  AuthUserNotExists,
} from './auth.errors';
import { CodeGeneratorService } from '@/common/code-generator/code-generator';
import { JwtEntity } from '@/application/entities/jwt';
import { JwtOwnService } from '@/common/jwt/jwt.service';
import { HashGeneratorService } from '@/common/hash/hash-generator.service';
import { EmailService } from '@/application/email/email.service';
import { RefreshTokensRepository } from '@/application/repositories/refreshs-tokens.repository';
import { PasswordHasherService } from '@/common/password-hasher/password-hasher';
// import { FunnelRepository } from '@/application/repositories/funnel.repository';
// import { PipelineRepository } from '@/application/repositories/pipeline.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: AccountsRepository,
    private readonly ownJwt: JwtOwnService,
    private readonly brcypt: PasswordHasherService,
    private readonly code: CodeGeneratorService,
    private readonly email: EmailService,
    private readonly refreshTokensCache: RefreshTokensRepository,
    private readonly hasher: HashGeneratorService,
    // private readonly funnelsRepository: FunnelRepository,
    // private readonly pipelinesRepository: PipelineRepository,
  ) {}

  // private async createBaseFunnel(accountId: string) {
  //   const funnel = await this.funnelsRepository.create({
  //     title: 'Funil Padrão',
  //     accountId,
  //   });
  //   await this.pipelinesRepository.create({
  //     funnelId: funnel.funnelid,
  //     title: 'Abordagem',
  //     headColor: '#111B21',
  //   });
  //   await this.pipelinesRepository.create({
  //     funnelId: funnel.funnelid,
  //     title: 'Ganho',
  //     headColor: '#399B61',
  //   });
  //   await this.pipelinesRepository.create({
  //     funnelId: funnel.funnelid,
  //     title: 'Perda',
  //     headColor: '#D46026',
  //   });
  // }

  public async signup(user: AccountSingUpDto) {
    try {
      const hashedPassword = await this.brcypt.toHash(user.password);
      const account: AccountEntity = new AccountEntity({
        username: user.username,
        email: user.email,
        password: hashedPassword,
      });
      const company: CompanyEntity = new CompanyEntity({
        companyCNPJ: user.companyCNPJ,
        companyCustomes: user.companyCustomers,
        companyEmplooyes: user.companyEmployees,
        companyName: user.companyname,
        companyType: user.companyType,
      });
      await this.database.registerAccount({
        account,
        company,
      });
      // await this.createBaseFunnel(account.accountId);
    } catch (excepetion) {
      if (excepetion instanceof AuthUserAlreadyRegistered) {
        throw new ConflictException(excepetion.message);
      }

      if (excepetion instanceof Error) {
        throw new BadRequestException(excepetion.message);
      }

      throw new InternalServerErrorException();
    }
  }

  public async signin(user: AccountSignInDto) {
    try {
      const userFound = await this.database.searchAccountByEmail(user.email);
      if (!userFound) {
        throw new AuthUserNotExists();
      }

      const iEquals = await this.brcypt.compare(user.password, userFound.hash);
      if (!iEquals) {
        throw new AuthUserNotExists();
      }

      const hash = this.hasher.createSHA256();
      await this.refreshTokensCache.regiterToken(hash, userFound.acountid);

      const accessToken = await this.ownJwt.sign({
        customTime: '4h',
        payload: new JwtEntity({
          body: {
            username: userFound.username,
          },
          sub: userFound.acountid,
          type: 'ACCESS',
        }),
      });

      const refreshToken = await this.ownJwt.sign({
        customTime: '6h',
        payload: new JwtEntity({
          sub: hash,
          type: 'REFRESH',
        }),
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (excepetion) {
      if (excepetion instanceof AuthUserNotExists) {
        throw new UnauthorizedException(excepetion.message);
      }

      if (excepetion instanceof Error) {
        throw new BadRequestException(excepetion.message);
      }

      throw new InternalServerErrorException();
    }
  }

  public async refreshTokens(accountId: string) {
    try {
      const userFound = await this.database.searchAccountById(accountId);
      if (!userFound) {
        throw new AuthUserNotExists();
      }

      const hash = this.hasher.createSHA256();
      await this.refreshTokensCache.regiterToken(hash, userFound.acountid);

      const accesstoken = await this.ownJwt.sign({
        customTime: '4h',
        payload: new JwtEntity({
          body: {
            username: userFound.username,
          },
          sub: userFound.acountid,
          type: 'ACCESS',
        }),
      });
      const refreshToken = await this.ownJwt.sign({
        customTime: '6h',
        payload: new JwtEntity({
          sub: hash,
          type: 'REFRESH',
        }),
      });

      return {
        accesstoken,
        refreshToken,
      };
    } catch (excepetion) {
      if (excepetion instanceof AuthUserNotExists) {
        throw new UnauthorizedException(excepetion.message);
      }

      if (excepetion instanceof Error) {
        throw new BadRequestException();
      }

      throw new InternalServerErrorException();
    }
  }

  public async forgetPassword(account: AccountForgetPassword) {
    try {
      const userFound = await this.database.searchAccountByEmail(account.email);
      if (!userFound) {
        throw new AuthUserNotExists();
      }

      await this.email.sendCodeVerify({
        username: userFound.username,
        to: account.email,
      });

      const hash = this.hasher.createSHA256(userFound.acountid);
      await this.refreshTokensCache.regiterToken(hash, userFound.acountid);

      const recoveryToken = await this.ownJwt.sign({
        payload: new JwtEntity({
          sub: hash,
          type: 'RECOVERY_TICKET',
        }),
        customTime: '5m',
      });

      return {
        token: recoveryToken,
        message:
          'Se exister uma conta com o e-mail, você receberá um código de verificação ! atenção: verifique sua caixa de email, até mesmo lixeira e spans !',
      };
    } catch (excepetion) {
      if (excepetion instanceof AuthUserNotExists) {
        throw new UnauthorizedException(excepetion.message);
      }

      if (excepetion instanceof Error) {
        throw new BadRequestException(excepetion.message);
      }

      throw new InternalServerErrorException();
    }
  }

  public async verifyCodeRecovery(code: string, email: string) {
    try {
      if (code !== (await this.code.generateCode())) {
        throw new AuthRecoveryCodeWrong();
      }
      const userFound = await this.database.searchAccountByEmail(email);
      if (!userFound) {
        throw new AuthUserNotExists();
      }

      const hash = this.hasher.createSHA256(userFound.acountid);
      const recoveryPayload = new JwtEntity({
        sub: hash,
        type: 'RESET_TICKET',
      });
      const resetToken = await this.ownJwt.sign({
        payload: recoveryPayload,
        customTime: '5m',
      });

      await this.refreshTokensCache.regiterToken(hash, userFound.acountid);
      return {
        resetToken,
      };
    } catch (excepetion) {
      if (excepetion instanceof AuthUserNotExists) {
        throw new UnauthorizedException();
      }

      if (excepetion instanceof AuthRecoveryCodeWrong) {
        throw new UnauthorizedException(excepetion.message);
      }

      if (excepetion instanceof Error) {
        throw new BadRequestException(excepetion.message);
      }

      throw new InternalServerErrorException();
    }
  }

  public async resetPassword(accountId: string, newPassword: string) {
    try {
      const hashedPassword = await this.brcypt.toHash(newPassword);
      await this.database.changePasswordFromAccount(accountId, hashedPassword);
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }

      throw new InternalServerErrorException();
    }
  }
}
