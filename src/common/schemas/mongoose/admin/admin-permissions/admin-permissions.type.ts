import { OmitType, PickType } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';
import { AdminPermissionOperations } from './admin-operations.type';
import { AdminResourcesEnum } from './admin-resources.enum';

export class AdminPermissionReadOperation extends PickType(AdminPermissionOperations, ['read'] as const) {}
export class AdminPermissionReadUpdateOperation extends PickType(AdminPermissionOperations, [
  'read',
  'update',
] as const) {}
export class AdminPermissionReadUpdateDeleteOperation extends OmitType(AdminPermissionOperations, [
  'create',
] as const) {}
export class AdminPermissionCreateReadUpdateOperation extends OmitType(AdminPermissionOperations, [
  'delete',
] as const) {}

export class AdminPermissions implements Record<AdminResourcesEnum, Partial<AdminPermissionOperations>> {
  @IsObject()
  @ValidateNested()
  admins: AdminPermissionOperations;

  @IsObject()
  @ValidateNested()
  adminRoles: AdminPermissionOperations;
}
