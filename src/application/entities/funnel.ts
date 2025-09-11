import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { NanoidGeneratorService } from '@/common/identifiers/nanoid-generator.service';
import { Replace } from '@/utility';

export interface IFunnelEntity {
  funnelid: string;
  funnilname: string;
  pipelines: string[];
}

export class FunnelEntity {
  private _self: IFunnelEntity;
  private _indefier: IdentifiersGeneratorService;

  constructor(
    funnel: Replace<
      IFunnelEntity,
      {
        funnelid?: string;
        pipelines?: string[];
      }
    >,
  ) {
    this._indefier = new NanoidGeneratorService();
    this._self = {
      funnelid: funnel.funnelid ?? this._indefier.generate('funnels'),
      pipelines: funnel.pipelines ?? [],
      funnilname: funnel.funnilname,
    };
  }

  public get funnelId(): string {
    return this._self.funnelid;
  }

  public get funnelName(): string {
    return this._self.funnilname;
  }

  public set funnelName(funnelName: string) {
    this._self.funnilname = funnelName;
  }

  public get pipelines(): string[] {
    return this._self.pipelines;
  }

  public addPipelines(pipelineId: string) {
    this._self.pipelines.push(pipelineId);
  }

  public removePipelines(pipelineId: string) {
    this._self.pipelines = this._self.pipelines.filter(
      (pipeId) => pipeId !== pipelineId,
    );
  }
}
