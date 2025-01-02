import { IsObject, ValidateNested } from 'class-validator';
import { Model } from 'mongoose';
import { BaseModel, IBaseInstanceMethods } from '../../base/base-schema';
import { AdminPermissions } from '../admin-permissions';
import { LocalizedText } from '../../common/localized-text';

export class AdminRole extends BaseModel<AdminRole> {
  @IsObject()
  @ValidateNested()
  name: LocalizedText;

  @IsObject()
  @ValidateNested()
  permissions: AdminPermissions;
}

export interface IAdminRoleInstanceMethods extends IBaseInstanceMethods {}
export interface IAdminRoleModel extends Model<AdminRole, Record<string, unknown>, IAdminRoleInstanceMethods> {}
