import { Injectable } from '@nestjs/common';

@Injectable()
export class TestStateService {
  currentAccountId: string | null = null;
}
