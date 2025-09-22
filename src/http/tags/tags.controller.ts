import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTag, UpdateTag } from '@/application/dto/settings';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTag(@Body() body: CreateTag) {
    return await this.tagsService.createTag(body);
  }

  @Get(':tagId')
  @UseGuards(AuthGuard)
  async getTag(@Param('tagId') tagId?: number) {
    if (tagId) {
      return await this.tagsService.getTag(tagId);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTags(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page && limit) {
      return await this.tagsService.getTags({
        page: parseInt(page),
        limit: parseInt(limit),
      });
    }
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateTag(@Body() body: UpdateTag) {
    return await this.tagsService.updateTag(body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteTag(@Body() body: number[]) {
    return await this.tagsService.deleteTag(body);
  }
}
