import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Model, Types } from 'mongoose';

export class Category {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @IsNotEmpty()
  tasks: Types.ObjectId[];

  @IsObject()
  createdBy: Types.ObjectId;

  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;
}

export interface ICategoryModel extends Model<Category, Record<string, unknown>> {}
