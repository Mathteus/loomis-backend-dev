import { Injectable } from '@nestjs/common';

export interface PipelineRecord {
  pipeid: string;
  title: string;
  isDefaut: boolean;
  headColor: string;
  funnelId: string;
}

export interface CreatePipelineProps {
  funnelId: string;
  title: string;
  headColor: string;
  isDefaut?: boolean;
}

export interface UpdatePipelineProps {
  pipelineId: string;
  dataUpdate: Partial<Pick<PipelineRecord, 'title' | 'headColor'>>;
}

@Injectable()
export abstract class PipelineRepository {
  abstract create(pipeline: CreatePipelineProps): Promise<PipelineRecord>;
  abstract getByFunnel(funnelId: string): Promise<PipelineRecord[]>;
  abstract getById(pipelineId: string): Promise<PipelineRecord | null>;
  abstract update(pipeline: UpdatePipelineProps): Promise<PipelineRecord>;
  abstract delete(pipelineId: string): Promise<void>;
}
