import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { taskState } from '../entities/task';

export class CreateTaskDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  taskName: string;

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsUUID()
  @IsNotEmpty()
  collaboratorId: string;

  @IsDateString()
  @IsNotEmpty()
  toDate: string;
}

export class UpdateTaskDto {
  @IsString()
  @Length(3, 50)
  @IsOptional()
  taskName?: string;

  @IsString()
  @Length(3, 50)
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsUUID()
  @IsOptional()
  collaboratorId?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;
}

export class TaskUpdateStateDto {
  @IsEnum(taskState)
  @IsNotEmpty()
  status: taskState;
}
