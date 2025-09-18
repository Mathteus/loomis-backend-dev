import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TestStateService } from './state.service';

@Injectable()
export class DummyAuthGuard implements CanActivate {
  constructor(private readonly state: TestStateService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // simulate CurrentUser() for refresh using an accountId in place of refreshToken
    req.user = { refreshToken: this.state.currentAccountId };
    return true;
  }
}

