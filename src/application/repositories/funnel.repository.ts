import { Injectable } from '@nestjs/common';

export interface FunnelRecord {
  funnelid: string;
  title: string;
  accountId: string;
}

@Injectable()
export abstract class FunnelRepository {
  abstract listByUser(userId: string): Promise<FunnelRecord[]>;
  abstract create(userId: string, title: string): Promise<FunnelRecord>;
  abstract getById(funnelId: string): Promise<FunnelRecord | null>;
  abstract updateTitle(funnelId: string, title: string): Promise<FunnelRecord>;
  abstract delete(funnelId: string): Promise<void>;
}

