import { Injectable } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { ItemPipeRepository, ItemPipeRecord } from '@/application/repositories/item-pipe.repository';

@Injectable()
export class PrismaItemPipeRepository implements ItemPipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listByPipeline(pipelineId: string): Promise<ItemPipeRecord[]> {
    const rows = await this.prisma.itemPipe.findMany({
      where: { pipelineId },
      orderBy: { itemid: 'asc' },
    });
    return rows.map((r) => ({
      itemid: r.itemid,
      contactId: r.contactId,
      collaboratorId: r.collaboratorId,
      amount: r.amount,
      tags: JSON.parse(r.tags) as string[],
      pipelineId: r.pipelineId,
    }));
  }

  async create(
    pipelineId: string,
    data: Omit<ItemPipeRecord, 'itemid' | 'pipelineId'>,
  ): Promise<ItemPipeRecord> {
    const row = await this.prisma.itemPipe.create({
      data: { ...data, tags: JSON.stringify(data.tags ?? []), pipelineId },
    });
    return {
      itemid: row.itemid,
      contactId: row.contactId,
      collaboratorId: row.collaboratorId,
      amount: row.amount,
      tags: JSON.parse(row.tags) as string[],
      pipelineId: row.pipelineId,
    };
  }

  async getById(itemId: string): Promise<ItemPipeRecord | null> {
    const row = await this.prisma.itemPipe.findUnique({ where: { itemid: itemId } });
    if (!row) return null;
    return {
      itemid: row.itemid,
      contactId: row.contactId,
      collaboratorId: row.collaboratorId,
      amount: row.amount,
      tags: JSON.parse(row.tags) as string[],
      pipelineId: row.pipelineId,
    };
  }

  async update(
    itemId: string,
    data: Partial<Omit<ItemPipeRecord, 'itemid' | 'pipelineId'>>,
  ): Promise<ItemPipeRecord> {
    const row = await this.prisma.itemPipe.update({
      where: { itemid: itemId },
      data: { ...data, tags: data.tags ? JSON.stringify(data.tags) : undefined },
    });
    return {
      itemid: row.itemid,
      contactId: row.contactId,
      collaboratorId: row.collaboratorId,
      amount: row.amount,
      tags: JSON.parse(row.tags) as string[],
      pipelineId: row.pipelineId,
    };
  }

  async delete(itemId: string): Promise<void> {
    await this.prisma.itemPipe.delete({ where: { itemid: itemId } });
  }
}
