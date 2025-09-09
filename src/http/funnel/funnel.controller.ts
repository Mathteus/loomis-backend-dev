import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FunnelService } from './funnel.service';
import { AuthGuard } from '@/http/auth/auth.guard';
import {
  PipelineFunnelDto,
  createFunnelDto,
  updateFunnelDto,
  deleteFunnelDto,
  getPipelinesDto,
  createPipelineDto,
  updatePipelineDto,
  deletePipelineDto,
  getItemsPipeDto,
  createItemPipeDto,
  updateItemPipeDto,
  deleteItemPipeDto,
} from '@/application/dto/funnel';

@Controller('funnels')
export class FunnelController {
  constructor(private readonly service: FunnelService) {}

  // Funnels
  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getFunnels(@Query() query: PipelineFunnelDto) {
    return this.service.getFunnels(query);
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFunnel(@Body() body: createFunnelDto) {
    return await this.service.createFunnel(body);
  }

  @UseGuards(AuthGuard)
  @Get(':funnelid')
  @HttpCode(HttpStatus.OK)
  async getFunnelById(@Param('funnelid') funnelId: string) {
    return await this.service.getFunnelById(funnelId);
  }

  @UseGuards(AuthGuard)
  @Put(':funnelid')
  @HttpCode(HttpStatus.OK)
  async updateFunnel(
    @Param('funnelid') funnelId: string,
    @Body() body: updateFunnelDto,
  ) {
    return await this.service.updateFunnel(funnelId, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':funnelid')
  @HttpCode(HttpStatus.OK)
  async deleteFunnel(
    @Param('funnelid') funnelId: string,
    @Body() body: deleteFunnelDto,
  ) {
    return await this.service.deleteFunnel(funnelId, body);
  }

  // Pipelines
  @UseGuards(AuthGuard)
  @Get(':funnelid/pipelines')
  @HttpCode(HttpStatus.OK)
  async getPipelinesByFunnel(
    @Param('funnelid') funnelId: string,
    @Query('userId') userId?: string,
  ) {
    const query: getPipelinesDto = { userId: userId ?? '', funnelId: funnelId };
    return await this.service.getPipelinesByFunnel(query);
  }

  @UseGuards(AuthGuard)
  @Post(':funnelid/pipelines')
  @HttpCode(HttpStatus.CREATED)
  async createPipeline(
    @Param('funnelid') funnelId: string,
    @Body() body: createPipelineDto,
  ) {
    const payload: createPipelineDto = {
      ...body,
      funnelId,
    };
    return await this.service.createPipeline(payload);
  }

  @UseGuards(AuthGuard)
  @Get(':funnelid/pipelines/:pipelineid')
  @HttpCode(HttpStatus.OK)
  async getPipelineById(
    @Param('funnelid') funnelId: string,
    @Param('pipelineid') pipelineId: string,
  ) {
    return await this.service.getPipelineById(funnelId, pipelineId);
  }

  @UseGuards(AuthGuard)
  @Put(':funnelid/pipelines/:pipelineid')
  @HttpCode(HttpStatus.OK)
  async updatePipeline(
    @Param('funnelid') funnelId: string,
    @Param('pipelineid') pipelineId: string,
    @Body() body: updatePipelineDto,
  ) {
    const payload: updatePipelineDto = {
      ...body,
      funnelId,
      pipelineId,
    };
    return await this.service.updatePipeline(payload);
  }

  @UseGuards(AuthGuard)
  @Delete(':funnelid/pipelines/:pipelineid')
  @HttpCode(HttpStatus.OK)
  async deletePipeline(
    @Param('funnelid') funnelId: string,
    @Param('pipelineid') pipelineId: string,
    @Body() body: deletePipelineDto,
  ) {
    const payload: deletePipelineDto = {
      ...body,
      funnelId,
      pipelineId,
    };
    return await this.service.deletePipeline(payload);
  }

  // Pipe items
  @UseGuards(AuthGuard)
  @Get(':funnelid/pipelines/:pipelineid/items')
  @HttpCode(HttpStatus.OK)
  async getItems(
    @Param('pipelineid') pipelineId: string,
    @Query('userId') userId?: string,
    @Param('funnelid') funnelId?: string,
  ) {
    const query: getItemsPipeDto = {
      userId: userId ?? '',
      funnelId: funnelId ?? '',
      pipeId: pipelineId,
    };
    return await this.service.getItemsByPipeline(query);
  }

  @UseGuards(AuthGuard)
  @Post(':funnelid/pipelines/:pipelineid/items')
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @Param('pipelineid') pipelineId: string,
    @Param('funnelid') funnelId: string,
    @Body() body: createItemPipeDto,
  ) {
    const payload: createItemPipeDto = {
      ...body,
      pipeId: pipelineId,
      funnelId,
    };
    return await this.service.createItem(payload);
  }

  @UseGuards(AuthGuard)
  @Get(':funnelid/pipelines/:pipelineid/items/:itemid')
  @HttpCode(HttpStatus.OK)
  async getItemById(
    @Param('pipelineid') pipelineId: string,
    @Param('itemid') itemId: string,
  ) {
    return await this.service.getItemById(pipelineId, itemId);
  }

  @UseGuards(AuthGuard)
  @Put(':funnelid/pipelines/:pipelineid/items/:itemid')
  @HttpCode(HttpStatus.OK)
  async updateItem(
    @Param('pipelineid') pipelineId: string,
    @Param('funnelid') funnelId: string,
    @Param('itemid') itemId: string,
    @Body() body: updateItemPipeDto,
  ) {
    const payload: updateItemPipeDto = {
      ...body,
      pipeId: pipelineId,
      funnelId,
      itemId,
    };
    return await this.service.updateItem(payload);
  }

  @UseGuards(AuthGuard)
  @Delete(':funnelid/pipelines/:pipelineid/items/:itemid')
  @HttpCode(HttpStatus.OK)
  async deleteItem(
    @Param('pipelineid') pipelineId: string,
    @Param('funnelid') funnelId: string,
    @Param('itemid') itemId: string,
    @Body() body: deleteItemPipeDto,
  ) {
    const payload: deleteItemPipeDto = {
      ...body,
      pipeId: pipelineId,
      funnelId,
      itemId,
    };
    return await this.service.deleteItem(payload);
  }
}
