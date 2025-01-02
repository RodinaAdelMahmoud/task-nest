import { Task } from '@common/schemas/mongoose/task';
import { PartialType, PickType } from '@nestjs/swagger';

export class UpdateTaskStatusDto extends PartialType(PickType(Task, ['status'] as const)) {}
