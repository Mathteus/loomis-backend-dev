import { Injectable } from '@nestjs/common';
import { TagsRepository } from '@/application/repositories/tags-repository';
import {
  CreateTag,
  UpdateTag,
  UpdateTagSchema,
} from '@/application/dto/settings';

export interface IGetTagsProps {
  page: number;
  limit: number;
}

@Injectable()
export class TagsService {
  constructor(private readonly tagDatabase: TagsRepository) {}

  async createTag(tagToCreate: CreateTag) {
    await this.tagDatabase.create(tagToCreate);
  }

  async deleteTag(tags: number[]) {
    await this.tagDatabase.delete(tags);
  }

  async getTags(props: IGetTagsProps) {
    return this.tagDatabase.getTagsByPage(props.page, props.limit);
  }

  async getTag(tagId: number) {
    return this.tagDatabase.findById(tagId);
  }

  async updateTag(props: UpdateTag) {
    await this.tagDatabase.update(
      props.tags.map((t: UpdateTagSchema) => {
        return {
          id: t.id,
          toUpdate: {
            name: t?.name ?? undefined,
            color: t?.color ?? undefined,
          },
        };
      }),
    );
  }
}
