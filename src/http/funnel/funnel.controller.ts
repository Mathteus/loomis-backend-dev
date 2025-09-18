// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Post,
//   Put,
//   UseGuards,
// } from '@nestjs/common';
// import { FunnelService } from './funnel.service';
// import { AuthGuard } from '@/http/auth/auth.guard';
// import { Access } from '@/decorators/access.decorator';
// import { CurrentUser } from '@/decorators/curent-user.decorator';
// import {
//   GetFunnelDto,
//   createFunnelDto,
//   createPipelineDto,
//   updatePipelineDto,
//   createItemPipeDto,
// } from '@/application/dto/funnel';
// import { IJwtPayload } from '@/common/jwt/jwt.service';

// @Controller('funnels')
// export class FunnelController {
//   constructor(private readonly service: FunnelService) {}

//   // Funnels
//   @UseGuards(AuthGuard)
//   @Access('funnel', 'READ')
//   @Get()
//   @HttpCode(HttpStatus.OK)
//   async getFunnels(@CurrentUser() user: IJwtPayload) {
//     const accountId = user?.sub;
//     const query: GetFunnelDto = { accountId };
//     return this.service.getFunnelsByAccount(query);
//   }

//   @UseGuards(AuthGuard)
//   @Access('funnel', 'CREATE')
//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   async createFunnel(
//     @CurrentUser() user: IJwtPayload,
//     @Body() body: createFunnelDto,
//   ) {
//     const accountId = user?.sub;
//     const payload: createFunnelDto = { ...body, accountId };
//     return await this.service.createFunnelByAccount(payload);
//   }

//   @UseGuards(AuthGuard)
//   @Access('funnel', 'READ')
//   @Get(':funnelid/board')
//   @HttpCode(HttpStatus.OK)
//   async getBoard(@Param('funnelid') funnelId: string) {
//     return await this.service.getAllFromFunnelId({ funnelId });
//   }

//   @UseGuards(AuthGuard)
//   @Access('funnel', 'DELETE')
//   @Delete(':funnelid')
//   @HttpCode(HttpStatus.OK)
//   async deleteFunnel(@Param('funnelid') funnelId: string) {
//     await this.service.deleteFunnel({ funnelId });
//     return { ok: true };
//   }

//   // Pipelines
//   @UseGuards(AuthGuard)
//   @Access('pipeline', 'CREATE')
//   @Post('/pipelines')
//   @HttpCode(HttpStatus.CREATED)
//   async createPipeline(
//     @CurrentUser() user: IJwtPayload,
//     @Body() body: createPipelineDto,
//   ) {
//     const accountId = user?.sub;
//     return await this.service.createPipeline({
//       ...body,
//       accountId,
//       funnelId: body.funnelId,
//     });
//   }

//   @UseGuards(AuthGuard)
//   @Access('pipeline', 'UPDATE')
//   @Put('/pipelines')
//   @HttpCode(HttpStatus.OK)
//   async updatePipeline(@Body() body: updatePipelineDto) {
//     return await this.service.updatePipeline({
//       ...body,
//       pipelineId: body.pipelineId,
//     });
//   }

//   @UseGuards(AuthGuard)
//   @Access('pipeline', 'DELETE')
//   @Delete('/pipelines/:pipelineid')
//   @HttpCode(HttpStatus.OK)
//   async deletePipeline(@Param('pipelineid') pipelineId: string) {
//     await this.service.deleteOpportunitiesByPipeline(pipelineId);
//     await this.service.deletePipeline(pipelineId);
//     return { ok: true };
//   }

//   @UseGuards(AuthGuard)
//   @Access('pipeitem', 'CREATE')
//   @Post('/pipelines/:pipelineid/opportunities')
//   @HttpCode(HttpStatus.CREATED)
//   async createItem(
//     @Param('pipelineid') pipelineId: string,
//     @Body() body: createItemPipeDto,
//   ) {
//     return await this.service.createOpotunity({
//       ...body,
//       pipelineId,
//     });
//   }

//   @UseGuards(AuthGuard)
//   @Access('pipeitem', 'DELETE')
//   @Delete('/pipelines/:pipelineid/opportunities')
//   @HttpCode(HttpStatus.OK)
//   async deleteOpportunities(@Param('pipelineid') pipelineId: string) {
//     await this.service.deleteOpportunitiesByPipeline(pipelineId);
//     return { ok: true };
//   }
// }
