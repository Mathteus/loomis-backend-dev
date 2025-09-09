import { Replace } from '@/utility';
import { randomUUID } from 'node:crypto';

export interface IPipeEntity {
  pipeid: string;
  title: string;
  isDefaut: boolean;
  items: string[];
  headColor: string;
}

export class PipeStandardInmutableError extends Error {
  constructor() {
    super('Pipe padrão não pode ser alterado');
  }
}

export class PipeEntity {
  _self: IPipeEntity;

  constructor(
    pipe: Replace<
      IPipeEntity,
      {
        pipeid?: string;
        isDefaut?: boolean;
        items?: string[];
      }
    >,
  ) {
    this._self = {
      pipeid: pipe.pipeid ?? randomUUID(),
      title: pipe.title,
      items: pipe.items ?? [],
      isDefaut: pipe.isDefaut ?? false,
      headColor: pipe.headColor,
    };
  }

  get id() {
    return this._self.pipeid;
  }

  get title() {
    return this._self.title;
  }

  get isDefaut() {
    return this._self.isDefaut;
  }

  get headColor() {
    return this._self.headColor;
  }

  set title(newTitle: string) {
    if (this._self.isDefaut) {
      throw new PipeStandardInmutableError();
    }

    this._self.title = newTitle;
  }

  get items() {
    return this._self.items;
  }

  public addItem(itemId: string) {
    this._self.items.push(itemId);
  }

  public removeItem(itemId: string) {
    this._self.items = this._self.items.filter((item) => item !== itemId);
  }
}
