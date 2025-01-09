import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Task, TaskPriorityEnum } from '@common/schemas/mongoose/task';

export class CreateTaskDto extends PickType(Task, ['title', 'dueDate', 'description', 'status', 'priority'] as const) {
  @ApiProperty({
    example: 'medium',
    description: 'The priority level of the task',
    enum: TaskPriorityEnum,
  })
  @IsString()
  priority: TaskPriorityEnum;

  @ApiProperty({
    example: '64f5fa2e5e9d4e3b5f6c89d0',
    description: 'The ID of the category associated with the task',
  })
  @IsMongoId()
  category: string;
}
