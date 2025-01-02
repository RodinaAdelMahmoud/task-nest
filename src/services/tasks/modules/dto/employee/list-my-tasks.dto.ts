import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BasePaginationQuery } from 'src/common/dtos/base-pagination.dto';

export enum TaskTypeEnum {
  ASSIGNED_TO_ME = 'ASSIGNED_TO_ME',
  ASSIGNED_BY_ME = 'ASSIGNED_BY_ME',
}

export enum TaskSortEnum {
  PRIORITY = 'PRIORITY',
  DUE_DATE = 'DUE_DATE',
}

export class ListTasksQueryDto extends BasePaginationQuery {
  @IsOptional()
  @IsEnum(TaskTypeEnum)
  @IsString()
  taskType?: TaskTypeEnum;

  @IsOptional()
  @IsEnum(TaskSortEnum)
  @IsString()
  sortBy?: TaskSortEnum;
}
