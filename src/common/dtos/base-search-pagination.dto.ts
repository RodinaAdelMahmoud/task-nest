import { IsOptional, IsString } from 'class-validator';
import { BasePaginationQuery } from './base-pagination.dto';
import { TransformTrim } from '@common/decorators/class-transformer';

export class BaseSearchPaginationQuery extends BasePaginationQuery {
  @IsOptional()
  @IsString()
  @TransformTrim()
  search?: string;
}
