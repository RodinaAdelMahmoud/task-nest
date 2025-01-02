import { TransformObjectId, TransformObjectIds } from '@common';
import { Task, TaskPriorityEnum } from '@common/schemas/mongoose/task';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInstance, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTaskDto extends PartialType(
  PickType(Task, ['title', 'dueDate', 'issuedTo', 'description', 'referenceUrl'] as const),
) {


  @ApiProperty({
    example: ['666948c751089c99f2bb09f6'],
  })
  @IsArray()
  @IsInstance(Types.ObjectId, { each: true })
  @TransformObjectIds()
  issuedTo: Types.ObjectId[];

  @ApiProperty({
    example: 'medium',
  })
  @IsOptional()
  @IsString()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum;
}
