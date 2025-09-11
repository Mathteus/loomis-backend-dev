import { Injectable } from '@nestjs/common';

export interface FunnelRecord {
  funnelid: string;
  title: string;
  accountId: string;
}

export interface FunnelRecordUpdate extends FunnelRecord {
  orderPipes: string[];
}

export interface CreateFunnelProps {
  title: string;
  accountId: string;
}

export interface UpdateFunnelProps {
  funnelId: string;
  title: string;
  orderPipes: string[];
}

export interface DeleteFunnelProps {
  funnelId: string;
}

export interface GetFunnelByIdProps {
  funnelId: string;
}

@Injectable()
export abstract class FunnelRepository {
  abstract getByUser(accountId: string): Promise<FunnelRecord[]>;
  abstract create(funnel: CreateFunnelProps): Promise<FunnelRecord>;
  abstract getById(funnel: GetFunnelByIdProps): Promise<FunnelRecord | null>;
  abstract update(funnel: UpdateFunnelProps): Promise<FunnelRecord>;
  abstract delete(funnel: DeleteFunnelProps): Promise<void>;
}
