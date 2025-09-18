import { Injectable } from '@nestjs/common';
import {
  CreateFunnelProps,
  DeleteFunnelProps,
  FunnelRecord,
  FunnelRepository,
  GetFunnelByIdProps,
  UpdateFunnelProps,
} from '@/application/repositories/funnel.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryFunnelRepository implements FunnelRepository {
  private funnels: FunnelRecord[] = [];

  async getByUser(accountId: string): Promise<FunnelRecord[]> {
    return this.funnels.filter((f) => f.accountId === accountId);
  }

  async create(funnel: CreateFunnelProps): Promise<FunnelRecord> {
    const record: FunnelRecord = {
      funnelid: randomUUID(),
      title: funnel.title,
      accountId: funnel.accountId,
    };
    this.funnels.push(record);
    return record;
  }

  async getById({ funnelId }: GetFunnelByIdProps): Promise<FunnelRecord | null> {
    return this.funnels.find((f) => f.funnelid === funnelId) ?? null;
  }

  async update(funnel: UpdateFunnelProps): Promise<FunnelRecord> {
    const idx = this.funnels.findIndex((f) => f.funnelid === funnel.funnelId);
    if (idx === -1) throw new Error('not found');
    this.funnels[idx].title = funnel.title;
    return this.funnels[idx];
  }

  async delete({ funnelId }: DeleteFunnelProps): Promise<void> {
    this.funnels = this.funnels.filter((f) => f.funnelid !== funnelId);
  }
}

