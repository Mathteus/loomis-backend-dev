import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from '@/http/auth/auth.controller';
import { AuthService } from '@/http/auth/auth.service';
import { AccountsRepository } from '@/application/repositories/accounts-repository';
import { InMemoryAccountsRepository } from './mocks/in-memory-accounts.repository';
import { RefreshTokensRepository } from '@/application/repositories/refreshs-tokens.repository';
import { InMemoryRefreshTokensRepository } from './mocks/in-memory-refresh-tokens.repository';
import { PasswordHasherService } from '@/common/password-hasher/password-hasher';
import { FakePasswordHasherService } from './mocks/fake-password-hasher.service';
import { EmailService } from '@/application/email/email.service';
import { FakeEmailService } from './mocks/fake-email.service';
import { CodeGeneratorService } from '@/common/code-generator/code-generator';
import { FakeCodeGeneratorService } from './mocks/fake-code-generator.service';
import { JwtOwnService } from '@/common/jwt/jwt.service';
import { FakeJwtOwnService } from './mocks/fake-jwt-own.service';
import { FunnelRepository } from '@/application/repositories/funnel.repository';
import { InMemoryFunnelRepository } from './mocks/in-memory-funnel.repository';
import { PipelineRepository } from '@/application/repositories/pipeline.repository';
import { InMemoryPipelineRepository } from './mocks/in-memory-pipeline.repository';
import { TestStateService } from './mocks/state.service';
import { HashGeneratorService } from '@/common/hash/hash-generator.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { RedisRefreshTokensService } from '@/application/database/redis-refresh-token';
// no Prisma imports to avoid side-effects

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        TestStateService,
        { provide: AccountsRepository, useClass: InMemoryAccountsRepository },
        {
          provide: RefreshTokensRepository,
          useClass: InMemoryRefreshTokensRepository,
        },
        { provide: PasswordHasherService, useClass: FakePasswordHasherService },
        { provide: EmailService, useClass: FakeEmailService },
        { provide: CodeGeneratorService, useClass: FakeCodeGeneratorService },
        { provide: JwtOwnService, useClass: FakeJwtOwnService },
        { provide: FunnelRepository, useClass: InMemoryFunnelRepository },
        {
          provide: PipelineRepository,
          useClass: InMemoryPipelineRepository,
        },
        // real hash generator (no external deps)
        HashGeneratorService,
        // Satisfy potential guard deps (even if mapped)
        {
          provide: JwtService,
          useValue: { verifyAsync: async () => ({ sub: 'x', type: 'ACCESS' }) },
        },
        { provide: ConfigService, useValue: { getOrThrow: () => 'test' } },
        { provide: Reflector, useValue: new Reflector() },
        {
          provide: RedisRefreshTokensService,
          useValue: {
            getTokenByHash: async () => '',
            removeTokenByHash: async () => undefined,
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const signupPayload = {
    username: 'John Doe',
    email: 'john@example.com',
    password: 'StrongP@ssw0rd!',
    companyname: 'Acme Inc',
    companyCNPJ: '84.172.252/0001-98',
    companyType: 'SERVICE_COMPANY',
    companyCustomers: '100+',
    companyEmployees: '21_50',
  };

  it('POST /auth/signup -> 201', async () => {
    const res = await request((app as any).getHttpAdapter().getInstance())
      .post('/auth/signup')
      .send(signupPayload)
      .expect(201);

    expect(res.text === '' || res.body == null).toBeTruthy();
  });

  it('POST /auth/signin -> 200 and tokens', async () => {
    const res = await request((app as any).getHttpAdapter().getInstance())
      .post('/auth/signin')
      .send({ email: signupPayload.email, password: signupPayload.password })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(typeof res.body.accessToken).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  // Note: refresh route uses guard; skipping e2e here due to guard wiring
});
