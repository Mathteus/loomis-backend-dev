import { Replace } from '@/utility';
import { randomUUID } from 'node:crypto';

export interface IItemPipeEntity {
  itemid: string;
  contactId: string;
  collaboratorId: string;
  amount: number;
  tags: string[];
  createdAt: Date;
}

export class ItemPipeEntity {
  _self: IItemPipeEntity;

  constructor(
    item: Replace<
      IItemPipeEntity,
      {
        itemid?: string;
        createdAt?: Date;
      }
    >,
  ) {
    this._self = {
      itemid: item.itemid ?? randomUUID(),
      contactId: item.contactId,
      collaboratorId: item.collaboratorId,
      amount: item.amount,
      tags: item.tags,
      createdAt: item.createdAt ?? new Date(),
    };
  }
}
