import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { addPaginationStages, ModelNames } from '@common';
import { ITaskModel } from '@common/schemas/mongoose/task';
import { CreateTaskDto } from '../../dto/user/create-task.dto';
import { ListTasksQueryDto } from '../../dto/user/list-my-tasks.dto';
import { UpdateTaskDto } from '../../dto/user/update-task.dto';
import { errorManager } from '../../shared/config/error.config';

@Injectable()
export class UserTasksService {
  constructor(@Inject(ModelNames.TASK) private taskModel: ITaskModel, private readonly eventEmitter: EventEmitter2) {}

  // Create a new task for the user
  async createNewTask(userId: string, body: CreateTaskDto) {
    if (body.dueDate < new Date()) {
      throw new ConflictException(errorManager.INVALID_DATE);
    }

    const newTask = new this.taskModel({
      ...body,
      createdBy: new Types.ObjectId(userId),
      priority: body.priority,
    });

    const savedTask = await newTask.save();

    return savedTask;
  }

  // Paginate tasks for the user
  async paginateTasks(userId: string, query: ListTasksQueryDto) {
    const { page, limit, status, category, sortBy } = query;

    const matchQuery: PipelineStage[] = [
      {
        $match: {
          ...(status && { status }),
          ...(category && { category: new Types.ObjectId(category) }),
        },
      },
    ];

    const [data, [{ total = 0 } = {}]] = await Promise.all([
      this.taskModel.aggregate([
        ...matchQuery,
        {
          $sort: {
            dueDate: 1,
            _id: -1,
            ...(sortBy && { [sortBy]: 1 }),
          },
        },
        ...addPaginationStages({ page, limit }),
      ]),
      this.taskModel.aggregate([...matchQuery]).count('total'),
    ]);

    const pages = Math.ceil(total / limit);

    return { data, total, limit, pages, page };
  }

  // Update a task by its ID for the user
  async updateTask(taskId: string, param: string, body: UpdateTaskDto) {
    const task = await this.taskModel.findOne({
      _id: taskId,
    });

    if (!task) {
      throw new NotFoundException(errorManager.TASK_NOT_FOUND);
    }

    task.set({
      ...body,
      ...(body.priority && {
        priority: body.priority,
      }),
    });
    await task.save();

    return task;
  }

  // Delete a task by its ID for the user
  async deleteTask(taskId: string) {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: taskId, isDeleted: false }, // Ensure task belongs to the user and isn't already deleted
      { isDeleted: true }, // Mark as deleted
      { new: true }, // Return the updated document
    );

    if (!task) {
      throw new NotFoundException(errorManager.TASK_NOT_FOUND);
    }

    return task;
  }
}
