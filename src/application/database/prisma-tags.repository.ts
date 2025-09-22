import { Injectable } from '@nestjs/common';
import {
  ITagCreateProps,
  ITagUpdateProps,
  TagsRepository,
  TagUpdateField,
} from '../repositories/tags-repository';
import { tags } from '@prisma/client';
import { TagEntity, TagNotFound } from '../entities/tag';
import { PrismaService } from './config/prisma.service';

@Injectable()
export class PrismaTagsRepository implements TagsRepository {
  constructor(private prisma: PrismaService) {}

  async create(props: ITagCreateProps): Promise<void> {
    const tagExists = await this.prisma.tags.findFirst({
      where: { tagname: props.name },
    });

    if (tagExists) {
      throw new TagNotFound();
    }

    await this.prisma.tags.create({
      data: {
        tagname: props.name,
        tagcolor: props.color,
      },
    });
  }

  async findById(tagid: number): Promise<TagEntity | null> {
    const tag = await this.prisma.tags.findUnique({
      where: { tagid },
    });

    if (!tag) {
      throw new TagNotFound();
    }

    return new TagEntity({
      tagid: tag.tagid,
      title: tag.tagname,
      color: tag.tagcolor,
      bgColor: tag.tagcolor + '33',
    });
  }

  async getTagsByPage(page: number, limit: number): Promise<TagEntity[]> {
    const tagsFound = await this.prisma.tags.findMany({
      skip: page * limit,
      take: limit,
    });

    if (!tagsFound) {
      throw new TagNotFound();
    }

    return tagsFound.map(
      (tag) =>
        new TagEntity({
          tagid: tag.tagid,
          title: tag.tagname,
          color: tag.tagcolor,
          bgColor: tag.tagcolor + '33',
        }),
    );
  }

  private createTagToUpdate(props: TagUpdateField): Partial<tags> {
    const tagToUpdate: Partial<tags> = {};

    if (props.name) {
      tagToUpdate.tagname = props.name;
    }

    if (props.color) {
      tagToUpdate.tagcolor = props.color;
    }

    return tagToUpdate;
  }

  async update(props: ITagUpdateProps[]): Promise<void> {
    for (const tag of props) {
      await this.prisma.tags.updateMany({
        where: { tagid: tag.id },
        data: this.createTagToUpdate(tag.toUpdate),
      });
    }
  }

  async delete(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.prisma.tags.deleteMany({
        where: { tagid: id },
      });
    }
  }
}
