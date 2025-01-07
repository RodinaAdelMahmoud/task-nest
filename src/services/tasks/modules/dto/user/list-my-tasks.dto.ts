import { TaskStatusEnum } from '@common/schemas/mongoose/task';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BasePaginationQuery } from 'src/common/dtos/base-pagination.dto';
import { Types, PipelineStage } from 'mongoose';

export enum TaskSortEnum {
  PRIORITY = 'PRIORITY',
  DUE_DATE = 'DUE_DATE',
}

export class ListTasksQueryDto extends BasePaginationQuery {
  @IsOptional()
  @IsEnum(TaskStatusEnum)
  @IsString()
  status?: TaskStatusEnum;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(TaskSortEnum)
  @IsString()
  sortBy?: TaskSortEnum;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
