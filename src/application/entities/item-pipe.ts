import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { NanoidGeneratorService } from '@/common/identifiers/nanoid-generator.service';
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
  private _self: IItemPipeEntity;
  private _identifiers: IdentifiersGeneratorService;

  constructor(
    item: Replace<
      IItemPipeEntity,
      {
        itemid?: string;
        createdAt?: Date;
      }
    >,
  ) {
    this._identifiers = new NanoidGeneratorService();
    this._self = {
      itemid: item.itemid ?? this._identifiers.generate('items-pipe'),
      contactId: item.contactId,
      collaboratorId: item.collaboratorId,
      amount: item.amount,
      tags: item.tags,
      createdAt: item.createdAt ?? new Date(),
    };
  }

  public get itemId(): string {
    return this._self.itemid;
  }

  public get contactId(): string {
    return this._self.contactId;
  }

  public get collaboratorId(): string {
    return this._self.collaboratorId;
  }

  public get amount(): number {
    return this._self.amount;
  }

  public set amout(amount: number) {
    this._self.amount = amount;
  }

  public get tags(): string[] {
    return this._self.tags;
  }

  public get createdAt(): Date {
    return this._self.createdAt;
  }
}
