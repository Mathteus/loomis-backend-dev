import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSION_ACTION,
  PERMISSION_RESOURCE,
  AccessAction,
  AccessResource,
} from '@/decorators/access.decorator';
import { AccountsRepository } from '@/application/repositories/accounts-repository';
import { can as canAccess } from '@/application/roles';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accounts: AccountsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resource = this.reflector.getAllAndOverride<
      AccessResource | undefined
    >(PERMISSION_RESOURCE, [context.getHandler(), context.getClass()]);

    const action = this.reflector.getAllAndOverride<AccessAction | undefined>(
      PERMISSION_ACTION,
      [context.getHandler(), context.getClass()],
    );

    if (!resource || !action) return true;

    const request = context.switchToHttp().getRequest();
    const jwtPayload = request['user'] as { sub?: string } | undefined;
    const accountId = jwtPayload?.sub;
    if (!accountId) throw new ForbiddenException();

    const userDb = await this.accounts.searchAccountById(accountId);
    const roleKey = this.mapRoleToRolesIndex(userDb.role);

    const allowed = canAccess(undefined, roleKey, resource, action);
    if (!allowed) throw new ForbiddenException('Permission denied');
    return true;
  }

  private mapRoleToRolesIndex(role?: string): 'ADMINISTRATOR' | 'CLIENT' {
    if ((role ?? '').toUpperCase() === 'ADMIN') return 'ADMINISTRATOR';
    return 'CLIENT';
  }
}
