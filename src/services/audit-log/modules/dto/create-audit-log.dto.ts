import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAuditLogDto {
  @ApiProperty({ example: '60d1234567890abc12345678', description: 'The ID of the task' })
  @IsMongoId()
  taskId: Types.ObjectId;

  @ApiProperty({ example: '60d1234567890abc12345678', description: 'The user ID of the modifier' })
  @IsMongoId()
  modifiedBy: Types.ObjectId;

  @ApiProperty({ example: 'status updated', description: 'Type of change made to the task' })
  @IsString()
  changeType: string;

  @ApiProperty({ example: 'pending', description: 'The previous value of the field', required: false })
  @IsOptional()
  @IsString()
  oldValue?: string;

  @ApiProperty({ example: 'completed', description: 'The new value of the field', required: false })
  @IsOptional()
  @IsString()
  newValue?: string;

  @ApiProperty({ example: '2025-01-08T08:00:00Z', description: 'Timestamp of the change' })
  timestamp: Date;
}
