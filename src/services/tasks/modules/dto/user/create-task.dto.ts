import { Task, TaskPriorityEnum } from '@common/schemas/mongoose/task';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CreateTaskDto extends PickType(Task, ['title', 'dueDate', 'description', 'status', 'priority'] as const) {
  @ApiProperty({
    example: 'medium',
    description: 'The priority level of the task',
    enum: TaskPriorityEnum,
  })
  @IsString()
  @IsEnum(TaskPriorityEnum)
  priority: TaskPriorityEnum;
  @ApiProperty({
    example: 'title',
    description: 'The category title of the task',
  })
  @IsString()
  category: string;
}
