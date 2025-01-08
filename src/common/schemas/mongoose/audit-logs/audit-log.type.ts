import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Model, Types } from 'mongoose';

export class AuditLog {
  @IsObject()
  @IsNotEmpty()
  taskId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  changeType: string;

  @IsDate()
  timeStamp: Date;

  @IsObject()
  @IsNotEmpty()
  modifiedBy: Types.ObjectId;

  @IsString()
  oldValue: string;

  @IsString()
  newValue: string;
}

export interface IAuditLogModel extends Model<AuditLog, Record<string, unknown>> {}
