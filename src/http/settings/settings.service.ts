import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AccountUpdate } from '@/application/dto/account';
import { TagsRepository } from '@/application/repositories/tags-repository';
import {
  CreateTag,
  UpdateTag,
  UpdateTagSchema,
} from '@/application/dto/settings';

export interface IUpdateAccountProps {
  accountId: string;
  toUpdate: AccountUpdate;
}

export interface ICreateTagProps {
  tagToCreate: CreateTag;
  page: number;
  limit: number;
}

export interface IGetTagsProps {
  page: number;
  limit: number;
}

export interface IDeleteTagProps {
  tagId: number[];
  page: number;
  limit: number;
}

export interface IGetTagProps {
  tagId: number;
}

export interface IUpdateTagProps {
  tagId: number;
  tagToUpdate: UpdateTag;
}

@Injectable()
export class SettingsService {
  constructor(
    private readonly authService: AuthService,
    private readonly tagDatabase: TagsRepository,
  ) {}

  async updateAccount(props: IUpdateAccountProps) {
    return await this.authService.updateAccount(props);
  }

  async createTag(tagToCreate: ICreateTagProps) {
    await this.tagDatabase.create(tagToCreate.tagToCreate);
    return this.tagDatabase.getTagsByPage(tagToCreate.page, tagToCreate.limit);
  }

  async deleteTag(props: IDeleteTagProps) {
    await this.tagDatabase.delete(props.tagId);
    return this.tagDatabase.getTagsByPage(props.page, props.limit);
  }

  async getTags(props: IGetTagsProps) {
    return this.tagDatabase.getTagsByPage(props.page, props.limit);
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
    return this.tagDatabase.getTagsByPage(1, 10);
  }

  async addChip() {}

  async removeChip() {}

  async updateChip() {}
}
