import { Replace } from '@/utility';

export class TagNotFound extends Error {
  constructor() {
    super('Tag not found');
  }
}

export interface ITag {
  tagid: number;
  title: string;
  color: string;
  bgColor: string;
}

export class TagEntity {
  private _self: ITag;

  constructor(tag: Replace<ITag, { tagid?: number }>) {
    this._self = {
      ...tag,
      tagid: tag.tagid || 0,
    };
  }

  get id(): number {
    return this._self.tagid;
  }

  get title(): string {
    return this._self.title;
  }

  get color(): string {
    return this._self.color;
  }

  get bgColor(): string {
    return this._self.bgColor;
  }

  set title(title: string) {
    this._self.title = title;
  }

  set color(color: string) {
    this._self.color = color;
  }

  set bgColor(bgColor: string) {
    this._self.bgColor = bgColor;
  }

  public toFrontend() {
    return {
      title: this._self.title,
      color: this._self.color,
      bgColor: this._self.bgColor,
    };
  }
}
