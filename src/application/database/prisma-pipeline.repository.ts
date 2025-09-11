import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import {
  PipelineRepository,
  PipelineRecord,
  CreatePipelineProps,
  UpdatePipelineProps,
} from '@/application/repositories/pipeline.repository';

@Injectable()
export class PrismaPipelineRepository implements PipelineRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByFunnel(funnelId: string): Promise<PipelineRecord[]> {
    const rows = await this.prisma.pipeline.findMany({
      where: { funnelId },
      orderBy: { title: 'asc' },
    });
    return rows.map((r) => ({
      pipeid: r.pipeid,
      title: r.title,
      isDefaut: r.isDefaut,
      headColor: r.headColor,
      funnelId: r.funnelId,
    }));
  }

  async create(pipeline: CreatePipelineProps): Promise<PipelineRecord> {
    const { funnelId, title, headColor, isDefaut } = pipeline;
    const row = await this.prisma.pipeline.create({
      data: {
        funnelId,
        title,
        headColor,
        isDefaut: isDefaut ?? false,
      },
    });
    return {
      pipeid: row.pipeid,
      title: row.title,
      isDefaut: row.isDefaut,
      headColor: row.headColor,
      funnelId: row.funnelId,
    };
  }

  async getById(pipelineId: string): Promise<PipelineRecord | null> {
    const row = await this.prisma.pipeline.findUnique({
      where: { pipeid: pipelineId },
    });
    if (!row) return null;
    return {
      pipeid: row.pipeid,
      title: row.title,
      isDefaut: row.isDefaut,
      headColor: row.headColor,
      funnelId: row.funnelId,
    };
  }

  async update(pipeline: UpdatePipelineProps): Promise<PipelineRecord> {
    const { pipelineId: pipeid, dataUpdate } = pipeline;
    const current = await this.prisma.pipeline.findUnique({
      where: { pipeid },
    });

    if (!current) {
      throw new BadRequestException('Pipeline not found');
    }

    if (current.isDefaut) {
      throw new BadRequestException('Pipe padrão não pode ser alterado');
    }

    const row = await this.prisma.pipeline.update({
      where: { pipeid },
      data: { ...dataUpdate },
    });

    return {
      pipeid: row.pipeid,
      title: row.title,
      isDefaut: row.isDefaut,
      headColor: row.headColor,
      funnelId: row.funnelId,
    };
  }

  async delete(pipelineId: string): Promise<void> {
    await this.prisma.pipeline.delete({ where: { pipeid: pipelineId } });
  }
}
