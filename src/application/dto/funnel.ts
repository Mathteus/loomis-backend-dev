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
export class PipelineFunnelDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class createFunnelDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class updateFunnelDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class deleteFunnelDto {
  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

// Pipelines
export class getPipelinesDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;
}

export class createPipelineDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

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
  userId: string;

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
  userId: string;
}

// Pipe Items
export class getItemsPipeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipeId: string;
}

export class createItemPipeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipeId: string;

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
  strings: string[];
}

export class updateItemPipeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipeId: string;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;

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
  strings?: string[];
}

export class deleteItemPipeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  funnelId: string;

  @IsUUID()
  @IsNotEmpty()
  pipeId: string;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;
}
