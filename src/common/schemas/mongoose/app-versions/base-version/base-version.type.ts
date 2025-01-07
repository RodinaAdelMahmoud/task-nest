import { IsObject, ValidateNested, IsBoolean, IsString, IsEnum } from 'class-validator';
import { Model } from 'mongoose';
import { BaseModel, IBaseInstanceMethods } from '../../base/base-schema';
import { AndroidVersion } from '../android-version';
import { BackEndVersionsSubSchemaType } from './base-version-sub-schemas/backend-versions';
import { VersionType } from './base-version.enum';

export class BaseVersion extends BaseModel<BaseVersion> {
  @IsObject()
  @ValidateNested()
  backendVersions: BackEndVersionsSubSchemaType;

  @IsBoolean()
  isDeprecated: boolean;

  @IsString()
  @IsEnum(VersionType)
  versionType: VersionType;
}

export interface IBaseVersionInstanceMethods extends IBaseInstanceMethods {}
export interface IBaseVersionModel extends Model<BaseVersion, Record<string, unknown>, IBaseVersionInstanceMethods> {}
