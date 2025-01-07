import { TransformObjectIds } from '@common';
import { Task, TaskPriorityEnum } from '@common/schemas/mongoose/task';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTaskDto extends PickType(Task, [
  'title',
  'dueDate',
  'category',
  'description',
  'status',
  'priority',
] as const) {
  @ApiProperty({
    example: 'medium',
    description: 'The priority level of the task',
    enum: TaskPriorityEnum,
  })
  @IsEnum(TaskPriorityEnum)
  priority: TaskPriorityEnum;
}
