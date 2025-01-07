import { Task, TaskPriorityEnum } from '@common/schemas/mongoose/task';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTaskDto extends PartialType(
  PickType(Task, ['title', 'dueDate', 'status', 'description', 'priority', 'category'] as const),
) {
  @ApiProperty({
    example: 'medium',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum;
}
