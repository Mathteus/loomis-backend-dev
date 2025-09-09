import {
  PipelineFunnelDto,
  createFunnelDto,
  updateFunnelDto,
  deleteFunnelDto,
  getPipelinesDto,
  createPipelineDto,
  updatePipelineDto,
  deletePipelineDto,
  getItemsPipeDto,
  createItemPipeDto,
  updateItemPipeDto,
  deleteItemPipeDto,
} from '@/application/dto/funnel';
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PipelineRepository } from '@/application/repositories/pipeline.repository';
import { FunnelRepository } from '@/application/repositories/funnel.repository';
import { ItemPipeRepository } from '@/application/repositories/item-pipe.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import Redis from 'ioredis';

@Injectable()
export class FunnelService {
  constructor(
    private readonly funnelsRepo: FunnelRepository,
    private readonly pipelinesRepo: PipelineRepository,
    private readonly itemsRepo: ItemPipeRepository,
    @Inject(CACHE_MANAGER) private readonly redis: Redis,
  ) {}

  // Funnels
  public async getFunnels(query: PipelineFunnelDto) {
    const cacheKey = `funnels:user:${query.userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as unknown;
    const response = await this.funnelsRepo.listByUser(query.userId);
    await this.redis.set(cacheKey, JSON.stringify(response));
    return response;
  }

  public async createFunnel(payload: createFunnelDto) {
    const created = await this.funnelsRepo.create(
      payload.userId,
      payload.title,
    );
    await this.redis.del(`funnels:user:${payload.userId}`);
    return created;
  }

  public async getFunnelById(funnelId: string) {
    const found = await this.funnelsRepo.getById(funnelId);
    if (!found) throw new NotFoundException('Funnel not found');
    return found;
  }

  public async updateFunnel(funnelId: string, payload: updateFunnelDto) {
    const exists = await this.funnelsRepo.getById(funnelId);
    if (!exists) throw new NotFoundException('Funnel not found');
    const updated = await this.funnelsRepo.updateTitle(funnelId, payload.title);
    await this.redis.del(`funnels:user:${payload.userId}`);
    return updated;
  }

  public async deleteFunnel(funnelId: string, payload: deleteFunnelDto) {
    const exists = await this.funnelsRepo.getById(funnelId);
    if (!exists) throw new NotFoundException('Funnel not found');
    await this.funnelsRepo.delete(funnelId);
    await this.redis.del(`funnels:user:${payload.userId}`);
    await this.redis.del(`pipelines:funnel:${funnelId}`);
    return { deleted: true };
  }

  // Pipelines
  public async getPipelinesByFunnel(query: getPipelinesDto) {
    const funnel = await this.funnelsRepo.getById(query.funnelId);
    if (!funnel) throw new NotFoundException('Funnel not found');
    const cacheKey = `pipelines:funnel:${query.funnelId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as unknown;
    const response = await this.pipelinesRepo.listByFunnel(query.funnelId);
    await this.redis.set(cacheKey, JSON.stringify(response));
    return response;
  }

  public async createPipeline(payload: createPipelineDto) {
    const funnel = await this.funnelsRepo.getById(payload.funnelId);
    if (!funnel) throw new NotFoundException('Funnel not found');
    const created = await this.pipelinesRepo.create(
      payload.funnelId,
      payload.title,
      payload.headColor,
    );
    await this.redis.del(`pipelines:funnel:${payload.funnelId}`);
    return created;
  }

  public async getPipelineById(funnelId: string, pipelineId: string) {
    const funnel = await this.funnelsRepo.getById(funnelId);
    if (!funnel) throw new NotFoundException('Funnel not found');
    const pipeline = await this.pipelinesRepo.getById(pipelineId);
    if (!pipeline || pipeline.funnelId !== funnelId)
      throw new NotFoundException('Pipeline not found in funnel');
    return pipeline;
  }

  public async updatePipeline(payload: updatePipelineDto) {
    const funnel = await this.funnelsRepo.getById(payload.funnelId);
    if (!funnel) throw new NotFoundException('Funnel not found');
    const pipeline = await this.pipelinesRepo.getById(payload.pipelineId);
    if (!pipeline || pipeline.funnelId !== payload.funnelId)
      throw new NotFoundException('Pipeline not found in funnel');
    const updated = await this.pipelinesRepo.update(payload.pipelineId, {
      title: payload.title,
      headColor: payload.headColor,
    });
    await this.redis.del(`pipelines:funnel:${payload.funnelId}`);
    return updated;
  }

  public async deletePipeline(payload: deletePipelineDto) {
    const funnel = await this.funnelsRepo.getById(payload.funnelId);
    if (!funnel) throw new NotFoundException('Funnel not found');
    const pipeline = await this.pipelinesRepo.getById(payload.pipelineId);
    if (!pipeline || pipeline.funnelId !== payload.funnelId)
      throw new NotFoundException('Pipeline not found in funnel');
    await this.pipelinesRepo.delete(payload.pipelineId);
    await this.redis.del(`pipelines:funnel:${payload.funnelId}`);
    await this.redis.del(`items:pipeline:${payload.pipelineId}`);
    return { deleted: true };
  }

  // Pipe Items
  public async getItemsByPipeline(query: getItemsPipeDto) {
    const pipeline = await this.pipelinesRepo.getById(query.pipeId);
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    const cacheKey = `items:pipeline:${query.pipeId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as unknown;
    const response = await this.itemsRepo.listByPipeline(query.pipeId);
    await this.redis.set(cacheKey, JSON.stringify(response));
    return response;
  }

  public async createItem(payload: createItemPipeDto) {
    const pipeline = await this.pipelinesRepo.getById(payload.pipeId);
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    const created = await this.itemsRepo.create(payload.pipeId, {
      contactId: payload.contactId,
      collaboratorId: payload.collaboratorId,
      amount: payload.amount,
      tags: payload.strings,
    });
    await this.redis.del(`items:pipeline:${payload.pipeId}`);
    return created;
  }

  public async getItemById(pipelineId: string, itemId: string) {
    const pipeline = await this.pipelinesRepo.getById(pipelineId);
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    const item = await this.itemsRepo.getById(itemId);
    if (!item || item.pipelineId !== pipelineId)
      throw new NotFoundException('Item not found in pipeline');
    return item;
  }

  public async updateItem(payload: updateItemPipeDto) {
    const pipeline = await this.pipelinesRepo.getById(payload.pipeId);
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    const item = await this.itemsRepo.getById(payload.itemId);
    if (!item || item.pipelineId !== payload.pipeId)
      throw new NotFoundException('Item not found in pipeline');
    const updated = await this.itemsRepo.update(payload.itemId, {
      contactId: payload.contactId,
      amount: payload.amount,
      tags: payload.strings,
    });
    await this.redis.del(`items:pipeline:${payload.pipeId}`);
    return updated;
  }

  public async deleteItem(payload: deleteItemPipeDto) {
    const pipeline = await this.pipelinesRepo.getById(payload.pipeId);
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    const item = await this.itemsRepo.getById(payload.itemId);
    if (!item || item.pipelineId !== payload.pipeId)
      throw new NotFoundException('Item not found in pipeline');
    await this.itemsRepo.delete(payload.itemId);
    await this.redis.del(`items:pipeline:${payload.pipeId}`);
    return { deleted: true };
  }
}
