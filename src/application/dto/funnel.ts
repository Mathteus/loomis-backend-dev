import { Optional } from '@nestjs/common';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsCurrency,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

// Funnels
export class GetFunnelDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;
}

export class GetFunnelByIdDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;
}

export class createFunnelDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class updateFunnelDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  orderPipes: string[];
}

export class deleteFunnelDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;
}

// Pipelines
export class getPipelinesDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;
}

export class GetPipelineByIdDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;
}

export class createPipelineDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsHexColor()
  @IsNotEmpty()
  headColor: string;
}

export class updatePipelineDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsHexColor()
  @IsOptional()
  headColor?: string;
}

export class deletePipelineDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;
}

// Pipe Items
export class getItemsPipeDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;
}

export class GetItemPipeByIdDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;
}

export class createItemPipeDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  @IsNotEmpty()
  contactId: string;

  @IsUUID()
  @IsNotEmpty()
  collaboratorId: string;

  @IsCurrency()
  @IsNotEmpty()
  amount: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  tags: string[];
}

export class updateItemPipeDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsUUID()
  @IsOptional()
  contactId?: string;

  @IsCurrency()
  @IsOptional()
  amount?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMinSize(0)
  @ArrayMaxSize(10)
  tags?: string[];
}

export class deleteItemPipeDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;
}

export class GetAllByFunnelIdDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;
}

export class createOpportunityDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;

  @IsString()
  @IsNotEmpty()
  contactId: string;

  @IsString()
  @IsNotEmpty()
  collaboratorId: string;

  @IsCurrency()
  @IsNotEmpty()
  amount: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  tags: string[];
}
