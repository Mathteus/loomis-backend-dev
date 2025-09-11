import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './config/prisma.service';
import {
  FunnelRepository,
  FunnelRecord,
  CreateFunnelProps,
  GetFunnelByIdProps,
  UpdateFunnelProps,
  DeleteFunnelProps,
} from '@/application/repositories/funnel.repository';

@Injectable()
export class PrismaFunnelRepository implements FunnelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(funnel: CreateFunnelProps): Promise<FunnelRecord> {
    const { title, accountId } = funnel;
    const row = await this.prisma.funnel.create({
      data: {
        title,
        accountId,
      },
    });
    return {
      funnelid: row.funnelid,
      title: row.title,
      accountId: row.accountId,
    };
  }

  async getByUser(accountId: string): Promise<FunnelRecord[]> {
    const rows = await this.prisma.funnel.findMany({
      where: { accountId: accountId },
      orderBy: { title: 'asc' },
    });
    return rows.map((r) => ({
      funnelid: r.funnelid,
      title: r.title,
      accountId: r.accountId,
    }));
  }

  async getById(funnel: GetFunnelByIdProps): Promise<FunnelRecord | null> {
    const row = await this.prisma.funnel.findFirst({
      where: {
        funnelid: funnel.funnelId,
      },
    });
    if (!row) return null;
    return {
      funnelid: row.funnelid,
      title: row.title,
      accountId: row.accountId,
    };
  }

  async update(funnel: UpdateFunnelProps): Promise<FunnelRecord> {
    const { funnelId: funnelid, orderPipes, title } = funnel;
    const current = await this.prisma.funnel.findUnique({
      where: { funnelid },
    });

    if (!current) {
      throw new BadRequestException('Funnel not found');
    }

    const row = await this.prisma.funnel.update({
      where: {
        funnelid,
      },
      data: {
        title,
        orderPipes: JSON.stringify(orderPipes),
      },
    });

    return {
      funnelid: row.funnelid,
      title: row.title,
      accountId: row.accountId,
    };
  }

  async delete(funnel: DeleteFunnelProps): Promise<void> {
    const current = await this.prisma.funnel.findUnique({
      where: { funnelid: funnel.funnelId },
    });

    if (!current) throw new NotFoundException('Funnel not found');

    await this.prisma.funnel.delete({
      where: { funnelid: funnel.funnelId },
    });
  }
}
