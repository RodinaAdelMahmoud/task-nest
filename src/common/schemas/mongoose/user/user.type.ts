import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Model, Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { UserStatusEnum } from './user.enum';
import { TransformObjectId, TransformObjectIds } from '@common/decorators/class-transformer';
import { IsFirebasePhoneNumber } from '@common/decorators/class-validator/common/is-valid-phone-number.decorator';
import { BaseModel, IBaseInstanceMethods } from '../base/base-schema';
import { IsUsername } from '@common/decorators/class-validator/common/is-username.decorator';
import { IsValidAge } from '@common/decorators/class-validator/common/is-valid-age.decorator';
import { LocalizedText } from '../common/localized-text';

export class User extends BaseModel<User> {
  @IsEmail()
  email: string;

  @ValidateNested()
  @IsNotEmpty()
  username: LocalizedText;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null)) // Transform birthDate to Date
  @IsValidAge() // Add custom age validation
  birthDate?: Date;

  // @IsString()
  // @IsOptional()
  // @Matches(/^[0-9]{1,20}$/, { message: 'Invalid ID number format' })
  // idNumber?: string;

  @IsString()
  @IsOptional()
  @IsFirebasePhoneNumber()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @IsFirebasePhoneNumber()
  additionalPhoneNumber?: string;

  @IsOptional()
  @IsInstance(Types.ObjectId)
  @TransformObjectId()
  nationality: Types.ObjectId;

  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;

  @IsOptional()
  @IsInstance(Types.ObjectId)
  @TransformObjectId()
  country: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  passwordReset?: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;

  @IsNotEmpty()
  @IsArray()
  @IsInstance(Types.ObjectId, { each: true })
  @TransformObjectIds()
  organisations: Types.ObjectId[];

  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @IsOptional()
  @ValidateNested()
  mainAddress?: LocalizedText;
}

export interface IUserInstanceMethods extends IBaseInstanceMethods {
  comparePassword(password: string): Promise<boolean>;
}
export interface IUserModel extends Model<User, Record<string, unknown>, IUserInstanceMethods> {}
