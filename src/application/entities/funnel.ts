import { Replace } from '@/utility';
import { randomUUID } from 'node:crypto';

export interface IFunnelEntity {
  funnelid: string;
  funnilname: string;
  pipelines: string[];
}

export class FunnelEntity {
  _self: IFunnelEntity;

  constructor(
    funnel: Replace<
      IFunnelEntity,
      {
        funnelid?: string;
        pipelines?: string[];
      }
    >,
  ) {
    this._self = {
      funnelid: funnel.funnelid ?? randomUUID(),
      pipelines: funnel.pipelines ?? [],
      funnilname: funnel.funnilname,
    };
  }
}
