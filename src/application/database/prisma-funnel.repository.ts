import { Injectable } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import { FunnelRepository, FunnelRecord } from '@/application/repositories/funnel.repository';

@Injectable()
export class PrismaFunnelRepository implements FunnelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listByUser(userId: string): Promise<FunnelRecord[]> {
    const rows = await this.prisma.funnel.findMany({
      where: { accountId: userId },
      orderBy: { title: 'asc' },
    });
    return rows.map((r) => ({ funnelid: r.funnelid, title: r.title, accountId: r.accountId }));
  }

  async create(userId: string, title: string): Promise<FunnelRecord> {
    const row = await this.prisma.funnel.create({
      data: { accountId: userId, title },
    });
    return { funnelid: row.funnelid, title: row.title, accountId: row.accountId };
  }

  async getById(funnelId: string): Promise<FunnelRecord | null> {
    const row = await this.prisma.funnel.findUnique({ where: { funnelid: funnelId } });
    if (!row) return null;
    return { funnelid: row.funnelid, title: row.title, accountId: row.accountId };
  }

  async updateTitle(funnelId: string, title: string): Promise<FunnelRecord> {
    const row = await this.prisma.funnel.update({ where: { funnelid: funnelId }, data: { title } });
    return { funnelid: row.funnelid, title: row.title, accountId: row.accountId };
  }

  async delete(funnelId: string): Promise<void> {
    // Cascade delete via relations
    await this.prisma.funnel.delete({ where: { funnelid: funnelId } });
  }
}

