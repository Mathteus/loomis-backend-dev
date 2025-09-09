import { Injectable } from '@nestjs/common';

export interface PipelineRecord {
  pipeid: string;
  title: string;
  isDefaut: boolean;
  headColor: string;
  funnelId: string;
}

@Injectable()
export abstract class PipelineRepository {
  abstract listByFunnel(funnelId: string): Promise<PipelineRecord[]>;
  abstract create(
    funnelId: string,
    title: string,
    headColor: string,
  ): Promise<PipelineRecord>;
  abstract getById(pipelineId: string): Promise<PipelineRecord | null>;
  abstract update(
    pipelineId: string,
    data: Partial<Pick<PipelineRecord, 'title' | 'headColor'>>,
  ): Promise<PipelineRecord>;
  abstract delete(pipelineId: string): Promise<void>;
}

