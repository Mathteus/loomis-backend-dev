import { TagEntity } from '../entities/tag';

export type TagUpdateField = {
  name?: string;
  color?: string;
};

export interface ITagCreateProps {
  name: string;
  color: string;
}

export interface ITagUpdateProps {
  id: number;
  toUpdate: TagUpdateField;
}

export abstract class TagsRepository {
  abstract create(props: ITagCreateProps): Promise<void>;
  abstract findById(tagid: number): Promise<TagEntity | null>;
  abstract update(props: ITagUpdateProps[]): Promise<void>;
  abstract delete(ids: number[]): Promise<void>;
  abstract getTagsByPage(page: number, limit: number): Promise<TagEntity[]>;
}
