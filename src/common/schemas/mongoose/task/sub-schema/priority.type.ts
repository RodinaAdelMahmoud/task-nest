import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TaskPriorityEnum, TaskPriorityScoreEnum } from '../task.enum';

export class Priority {
  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskPriorityEnum)
  level: TaskPriorityEnum;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(TaskPriorityScoreEnum)
  score: TaskPriorityScoreEnum;
}
