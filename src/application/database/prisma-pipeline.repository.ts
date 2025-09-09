import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { PipelineRepository, PipelineRecord } from '@/application/repositories/pipeline.repository';

@Injectable()
export class PrismaPipelineRepository implements PipelineRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listByFunnel(funnelId: string): Promise<PipelineRecord[]> {
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

  async create(
    funnelId: string,
    title: string,
    headColor: string,
  ): Promise<PipelineRecord> {
    const row = await this.prisma.pipeline.create({
      data: { funnelId, title, headColor },
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
    const row = await this.prisma.pipeline.findUnique({ where: { pipeid: pipelineId } });
    if (!row) return null;
    return {
      pipeid: row.pipeid,
      title: row.title,
      isDefaut: row.isDefaut,
      headColor: row.headColor,
      funnelId: row.funnelId,
    };
  }

  async update(
    pipelineId: string,
    data: Partial<Pick<PipelineRecord, 'title' | 'headColor'>>,
  ): Promise<PipelineRecord> {
    const current = await this.prisma.pipeline.findUnique({ where: { pipeid: pipelineId } });
    if (!current) throw new BadRequestException('Pipeline not found');
    if (current.isDefaut && data.title) {
      throw new BadRequestException('Pipe padrão não pode ser alterado');
    }
    const row = await this.prisma.pipeline.update({
      where: { pipeid: pipelineId },
      data: { ...data },
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

