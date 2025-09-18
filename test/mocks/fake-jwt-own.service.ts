import { Injectable } from '@nestjs/common';
import { JwtEntity } from '@/application/entities/jwt';
import { JwtOwnService } from '@/common/jwt/jwt.service';

@Injectable()
export class FakeJwtOwnService implements JwtOwnService {
  // @ts-expect-error allow class substitution compatible with injectable token
  async sign({ payload }: { payload: JwtEntity; customTime: string }): Promise<string> {
    const obj = payload.toPlainObject();
    return `token:${obj.type}:${obj.sub}`;
  }

  // @ts-expect-error allow class substitution compatible with injectable token
  async verify(_: string): Promise<JwtEntity> {
    return new JwtEntity({ sub: 'test', type: 'ACCESS' });
  }
}

