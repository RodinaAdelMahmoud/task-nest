import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Model } from 'mongoose';
import { BaseModel, IBaseInstanceMethods } from '../base/base-schema';
import { AdminRoleSubSchemaType } from './admin-subschemas/admin-role';
import { AdminStatusEnum } from './admin.enum';
import { LocalizedText } from '../common/localized-text';
import { ApiProperty } from '@nestjs/swagger';

export class Admin extends BaseModel<Admin> {
  @IsObject()
  @ValidateNested()
  name: LocalizedText;

  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;


  @IsObject()
  @ValidateNested()
  role: AdminRoleSubSchemaType;


  @IsOptional()
  @IsString()
  @IsEnum(AdminStatusEnum)
  status?: AdminStatusEnum;

}

export interface IAdminInstanceMethods extends IBaseInstanceMethods {
  comparePassword(password: string): Promise<boolean>;
}
export interface IAdminModel extends Model<Admin, Record<string, unknown>, IAdminInstanceMethods> {}
