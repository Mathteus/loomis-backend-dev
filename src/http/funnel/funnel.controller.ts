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
  UseGuards,
} from '@nestjs/common';
import { FunnelService } from './funnel.service';
import { AuthGuard } from '@/http/auth/auth.guard';
import { Access } from '@/decorators/access.decorator';
import { CurrentUser } from '@/decorators/curent-user.decorator';
import {
  GetFunnelDto,
  createFunnelDto,
  updateFunnelDto,
  deleteFunnelDto,
  createPipelineDto,
  updatePipelineDto,
  deletePipelineDto,
  createItemPipeDto,
  updateItemPipeDto,
  deleteItemPipeDto,
} from '@/application/dto/funnel';
import { IJwtPayload } from '@/common/jwt/jwt.service';

@Controller('funnels')
export class FunnelController {
  constructor(private readonly service: FunnelService) {}

  // Funnels
  @UseGuards(AuthGuard)
  @Access('funnel', 'READ')
  @Get()
  @HttpCode(HttpStatus.OK)
  async getFunnels(@CurrentUser() user: IJwtPayload) {
    const accountId = user?.sub;
    const query: GetFunnelDto = { accountId };
    return this.service.getFunnelsByAccount(query);
  }

  @UseGuards(AuthGuard)
  @Access('funnel', 'CREATE')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFunnel(
    @CurrentUser() user: IJwtPayload,
    @Body() body: createFunnelDto,
  ) {
    const accountId = user?.sub;
    const payload: createFunnelDto = { ...body, accountId };
    return await this.service.createFunnelByAccount(payload);
  }

  // Board data: pipelines + opportunities
  @UseGuards(AuthGuard)
  @Access('funnel', 'READ')
  @Get(':funnelid/board')
  @HttpCode(HttpStatus.OK)
  async getBoard(@Param('funnelid') funnelId: string) {
    return await this.service.getAllFromFunnelId({ funnelId });
  }

  @UseGuards(AuthGuard)
  @Access('funnel', 'UPDATE')
  @Put(':funnelid')
  @HttpCode(HttpStatus.OK)
  async updateFunnel(
    @Param('funnelid') funnelId: string,
    @Body() body: updateFunnelDto,
  ) {
    return await this.service.updatePipelesByFunnelId({ ...body, funnelId });
  }

  @UseGuards(AuthGuard)
  @Access('funnel', 'DELETE')
  @Delete(':funnelid')
  @HttpCode(HttpStatus.OK)
  async deleteFunnel(
    @Param('funnelid') funnelId: string,
    @Body() body: deleteFunnelDto,
  ) {
    await this.service.deleteFunnel({ funnelId });
    return { ok: true };
  }

  // Pipelines
  @UseGuards(AuthGuard)
  @Access('pipeline', 'READ')
  @Get(':funnelid/pipelines')
  @HttpCode(HttpStatus.OK)
  async getPipelinesByFunnel(
    @Param('funnelid') funnelId: string,
    @CurrentUser() user: IJwtPayload,
  ) {
    const accountId = user?.sub;
    return await this.service.getPipelinesByFunnel({
      accountId,
      funnelId: funnelId,
    });
  }

  @UseGuards(AuthGuard)
  @Access('pipeline', 'CREATE')
  @Post(':funnelid/pipelines')
  @HttpCode(HttpStatus.CREATED)
  async createPipeline(
    @CurrentUser() user: IJwtPayload,
    @Param('funnelid') funnelId: string,
    @Body() body: createPipelineDto,
  ) {
    const accountId = user?.sub;
    return await this.service.createPipeline({
      ...body,
      accountId,
      funnelId,
    });
  }

  @UseGuards(AuthGuard)
  @Access('pipeline', 'UPDATE')
  @Put(':funnelid/pipelines/:pipelineid')
  @HttpCode(HttpStatus.OK)
  async updatePipeline(
    @Param('funnelid') funnelId: string,
    @Param('pipelineid') pipelineId: string,
    @Body() body: updatePipelineDto,
  ) {
    return await this.service.updatePipeline({
      ...body,
      funnelId,
      pipelineId,
    });
  }

  @UseGuards(AuthGuard)
  @Access('pipeline', 'DELETE')
  @Delete(':funnelid/pipelines/:pipelineid')
  @HttpCode(HttpStatus.OK)
  async deletePipeline(
    @CurrentUser() user: IJwtPayload,
    @Param('funnelid') funnelId: string,
    @Param('pipelineid') pipelineId: string,
    @Body() body: deletePipelineDto,
  ) {
    const accountId = user?.sub;
    await this.service.deleteOpportunitiesByPipeline(pipelineId);
    await this.service.deletePipeline(pipelineId);
    return { ok: true };
  }

  // Opportunities
  @UseGuards(AuthGuard)
  @Access('pipeitem', 'READ')
  @Get(':funnelid/pipelines/:pipelineid/opportunities')
  @HttpCode(HttpStatus.OK)
  async getItems(
    @Param('pipelineid') pipelineId: string,
    @Param('funnelid') funnelId: string,
  ) {
    return await this.service.getItemsByPipeline({
      funnelId,
      pipelineId,
    });
  }

  @UseGuards(AuthGuard)
  @Access('pipeitem', 'CREATE')
  @Post(':funnelid/pipelines/:pipelineid/opportunities')
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @CurrentUser() user: IJwtPayload,
    @Param('pipelineid') pipelineId: string,
    @Param('funnelid') funnelId: string,
    @Body() body: createItemPipeDto,
  ) {
    const accountId = user?.sub;
    return await this.service.createOpotunity({
      ...body,
      accountId,
      pipelineId,
      funnelId,
    });
  }

  // Delete all opportunities from a pipeline
  @UseGuards(AuthGuard)
  @Access('pipeitem', 'DELETE')
  @Delete(':funnelid/pipelines/:pipelineid/opportunities')
  @HttpCode(HttpStatus.OK)
  async deleteOpportunities(
    @Param('pipelineid') pipelineId: string,
    @Param('funnelid') funnelId: string,
  ) {
    await this.service.deleteOpportunitiesByPipeline(pipelineId);
    return { ok: true };
  }
}
