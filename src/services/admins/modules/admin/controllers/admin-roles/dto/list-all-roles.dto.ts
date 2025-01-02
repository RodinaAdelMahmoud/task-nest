import { IsOptional, IsString } from 'class-validator';

export class ListAllRolesForList {
  @IsOptional()
  @IsString()
  search?: string;
}
