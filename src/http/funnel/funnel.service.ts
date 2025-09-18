// import {
//   GetFunnelDto,
//   createFunnelDto,
//   createPipelineDto,
//   updatePipelineDto,
//   getItemsPipeDto,
//   createItemPipeDto,
//   GetAllByFunnelIdDto,
// } from '@/application/dto/funnel';
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PipelineRepository } from '@/application/repositories/pipeline.repository';
// import { FunnelRepository } from '@/application/repositories/funnel.repository';
// import {
//   ItemPipeRecord,
//   ItemPipeRepository,
// } from '@/application/repositories/item-pipe.repository';

// @Injectable()
// export class FunnelService {
//   constructor(
//     private readonly funnelsRepository: FunnelRepository,
//     private readonly pipelinesRepository: PipelineRepository,
//     private readonly itemsRepository: ItemPipeRepository,
//   ) {}

//   public async createFunnelByAccount(payload: createFunnelDto) {
//     return await this.funnelsRepository.create({
//       title: payload.title,
//       accountId: payload.accountId,
//     });
//   }

//   public async getFunnelsByAccount(body: GetFunnelDto) {
//     return await this.funnelsRepository.getByUser(body.accountId);
//   }

//   public async getAllFromFunnelId(payload: GetAllByFunnelIdDto) {
//     const funnel = await this.funnelsRepository.getById({
//       funnelId: payload.funnelId,
//     });
//     if (!funnel) throw new NotFoundException('Funnel not found');

//     const pipelines = await this.pipelinesRepository.getByFunnel(
//       payload.funnelId,
//     );
//     if (!pipelines) {
//       throw new NotFoundException('Pipeline not found');
//     }
//     const result = [] as Array<{
//       pipeline: (typeof pipelines)[number];
//       opportunities: ItemPipeRecord[];
//     }>;
//     for (const pipe of pipelines) {
//       const opportunities = await this.itemsRepository.listByPipeline(
//         pipe.pipeid,
//       );
//       result.push({ pipeline: pipe, opportunities: opportunities ?? [] });
//     }
//     return result;
//   }

//   public async deleteFunnel(payload: { funnelId: string }) {
//     await this.funnelsRepository.delete({ funnelId: payload.funnelId });
//   }

//   public async createPipeline(payload: createPipelineDto) {
//     return await this.pipelinesRepository.create({
//       funnelId: payload.funnelId,
//       title: payload.title,
//       headColor: payload.headColor,
//     });
//   }

//   public async updatePipeline(payload: updatePipelineDto) {
//     const { pipelineId, ...rest } = payload;
//     return await this.pipelinesRepository.update({
//       pipelineId,
//       dataUpdate: {
//         title: rest.title,
//         headColor: rest.headColor,
//       },
//     });
//   }

//   public async deletePipeline(pipelineId: string) {
//     await this.pipelinesRepository.delete(pipelineId);
//   }

//   // Opportunities
//   public async createOpotunity(payload: createItemPipeDto) {
//     const pipeline = await this.pipelinesRepository.getById(payload.pipelineId);
//     if (!pipeline) {
//       throw new NotFoundException('Pipeline not found');
//     }

//     return await this.itemsRepository.create(payload.pipelineId, {
//       title: payload.title,
//       contactId: payload.contactId,
//       collaboratorId: payload.collaboratorId,
//       amount: payload.amount,
//       tags: payload.tags,
//       accountId: payload.accountId,
//     });
//   }

//   public async getOpportyById(payload: getItemsPipeDto) {
//     return await this.itemsRepository.listByPipeline(payload.pipelineId);
//   }

//   public async deleteOpportunitiesByPipeline(pipelineId: string) {
//     await this.itemsRepository.deleteByPipeline(pipelineId);
//   }
// }
