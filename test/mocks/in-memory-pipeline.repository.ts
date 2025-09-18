import { Injectable } from '@nestjs/common';
import {
  CreatePipelineProps,
  PipelineRecord,
  PipelineRepository,
  UpdatePipelineProps,
} from '@/application/repositories/pipeline.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryPipelineRepository implements PipelineRepository {
  private pipes: PipelineRecord[] = [];

  async create(pipeline: CreatePipelineProps): Promise<PipelineRecord> {
    const record: PipelineRecord = {
      pipeid: randomUUID(),
      title: pipeline.title,
      isDefaut: Boolean(pipeline.isDefaut),
      headColor: pipeline.headColor,
      funnelId: pipeline.funnelId,
    };
    this.pipes.push(record);
    return record;
  }

  async getByFunnel(funnelId: string): Promise<PipelineRecord[]> {
    return this.pipes.filter((p) => p.funnelId === funnelId);
  }

  async getById(pipelineId: string): Promise<PipelineRecord | null> {
    return this.pipes.find((p) => p.pipeid === pipelineId) ?? null;
  }

  async update(update: UpdatePipelineProps): Promise<PipelineRecord> {
    const idx = this.pipes.findIndex((p) => p.pipeid === update.pipelineId);
    if (idx === -1) throw new Error('not found');
    const prev = this.pipes[idx];
    this.pipes[idx] = { ...prev, ...update.dataUpdate } as PipelineRecord;
    return this.pipes[idx];
  }

  async delete(pipelineId: string): Promise<void> {
    this.pipes = this.pipes.filter((p) => p.pipeid !== pipelineId);
  }
}

