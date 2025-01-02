import {
  IsArray,
  IsDate,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Model, Types } from 'mongoose';
import { Priority } from './sub-schema';
import { TaskStatusEnum } from './task.enum';
import { BaseModel } from '../base/base-schema';
import { TransformObjectId, TransformObjectIds } from '@common/decorators/class-transformer';

export class Task extends BaseModel<Task> {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  // @IsOptional()
  // @IsArray()
  // notes?: string[];

  @IsDate()
  dueDate: Date;

  @IsInstance(Types.ObjectId)
  @TransformObjectId()
  issuedBy: Types.ObjectId;

  @IsArray()
  @IsInstance(Types.ObjectId, { each: true })
  @TransformObjectIds()
  issuedTo: Types.ObjectId[];

  // @IsInstance(Types.ObjectId)
  // @TransformObjectId()
  // region: Types.ObjectId;

  @IsInstance(Types.ObjectId)
  @TransformObjectId()
  branch: Types.ObjectId;

  @IsObject()
  @ValidateNested()
  priority: Priority;

  @IsOptional()
  @IsString()
  @IsUrl()
  referenceUrl?: string;

  @IsString()
  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;

  @IsNotEmpty()
  @IsInstance(Types.ObjectId)
  @TransformObjectId()
  organisation: Types.ObjectId;
}

export interface ITaskModel extends Model<Task, Record<string, unknown>> {}
