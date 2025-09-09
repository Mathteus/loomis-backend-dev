import { Injectable } from '@nestjs/common';

export interface ItemPipeRecord {
  itemid: string;
  contactId: string;
  collaboratorId: string;
  amount: number;
  tags: string[];
  pipelineId: string;
}

@Injectable()
export abstract class ItemPipeRepository {
  abstract listByPipeline(pipelineId: string): Promise<ItemPipeRecord[]>;
  abstract create(
    pipelineId: string,
    data: Omit<ItemPipeRecord, 'itemid' | 'pipelineId'>,
  ): Promise<ItemPipeRecord>;
  abstract getById(itemId: string): Promise<ItemPipeRecord | null>;
  abstract update(
    itemId: string,
    data: Partial<Omit<ItemPipeRecord, 'itemid' | 'pipelineId'>>,
  ): Promise<ItemPipeRecord>;
  abstract delete(itemId: string): Promise<void>;
}

