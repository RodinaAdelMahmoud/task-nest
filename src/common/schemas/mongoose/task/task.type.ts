import { IsBoolean, IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { Model, Types } from 'mongoose';

export class Task {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsDate()
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsObject()
  @IsNotEmpty()
  category: Types.ObjectId;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;
}

export interface ITaskModel extends Model<Task, Record<string, unknown>> {}
