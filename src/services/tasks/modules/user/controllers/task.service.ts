import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { addPaginationStages, ModelNames } from '@common';
import { ITaskModel } from '@common/schemas/mongoose/task';
import { CreateTaskDto } from '../../dto/user/create-task.dto';
import { ListTasksQueryDto } from '../../dto/user/list-my-tasks.dto';
import { UpdateTaskDto } from '../../dto/user/update-task.dto';
import { errorManager } from '../../shared/config/error.config';
import { ICategoryModel } from '@common/schemas/mongoose/category';
import { AuditLogService } from 'src/services/audit-log/modules/controllers/audit-log.service';

@Injectable()
export class UserTasksService {
  constructor(
    @Inject(ModelNames.TASK) private taskModel: ITaskModel,
    @Inject(ModelNames.CATEGORY) private categoryModel: ICategoryModel,
    private readonly auditLogService: AuditLogService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  //=====================  Create a new task for the user
  async createNewTask(userId: string, body: CreateTaskDto) {
    const { category: categoryId, ...taskData } = body;

    // Validate the category ID
    const category = await this.categoryModel.findOne({ _id: categoryId, isDeleted: false });
    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }

    const newTask = new this.taskModel({
      ...taskData,
      category: categoryId,
    });

    const savedTask = await newTask.save();

    // Add task to category's task list
    category.tasks.push(savedTask._id);
    await category.save();

    return savedTask;
  }

  //=====================  Paginate tasks for the user
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

  //=====================  Update a task by its ID for the user
  async updateTask(taskId: string, body: UpdateTaskDto) {
    const task = await this.taskModel.findById(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const oldValues = {
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      title: task.title,
      description: task.description,
    };

    const updatedValues = {
      status: body.status ?? oldValues.status,
      priority: body.priority ?? oldValues.priority,
      dueDate: body.dueDate ?? oldValues.dueDate,
      title: body.title ?? oldValues.title,
      description: body.description ?? oldValues.description,
    };

    const changes = [];
    for (const field of Object.keys(updatedValues)) {
      if (updatedValues[field] !== oldValues[field]) {
        changes.push({
          field,
          oldValue: oldValues[field],
          newValue: updatedValues[field],
          type: `${field} updated`,
        });
      }
    }

    if (changes.length === 0) {
      throw new BadRequestException('No changes made');
    }

    // Update the task with new values
    Object.assign(task, updatedValues);
    await task.save();

    // Emit an event for each change
    for (const change of changes) {
      this.eventEmitter.emit('task.updated', {
        taskId,
        ...change,
      });

      // Log the change to the Audit Log
      await this.auditLogService.logTaskChange(taskId, change.type, change.oldValue, change.newValue);
    }

    return {
      message: 'Task updated successfully',
      task: task,
    };
  }

  //=====================  Delete a task by its ID for the user
  async deleteTask(taskId: string) {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: taskId, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!task) {
      throw new NotFoundException(errorManager.TASK_NOT_FOUND);
    }
    await this.auditLogService.logTaskChange(taskId, 'Task deleted', '', '');

    return task;
  }

  //===================== Archive a task
  async archiveTask() {
    const result = await this.taskModel.updateMany(
      {
        isArchived: false,
        status: 'Done',
      },
      { $set: { isArchived: true } },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('No tasks found to archive');
    }

    return {
      message: 'Tasks archived successfully',
      archivedCount: result.modifiedCount,
    };
  }

  //===================== Get archived tasks
  async getArchivedTasks(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const archivedTasks = await this.taskModel.find({ isArchived: true }).skip(skip).limit(limit);

    const totalArchivedTasks = await this.taskModel.countDocuments({ isArchived: true });

    const totalPages = Math.ceil(totalArchivedTasks / limit);

    return {
      archivedTasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalArchivedTasks,
        limit,
      },
    };
  }

  //=====================  restore archived task
  async restoreTask() {
    const result = await this.taskModel.updateMany(
      {
        isArchived: true,
        status: 'Done',
      },
      { $set: { isArchived: false } },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('No tasks found');
    }

    return {
      message: 'Tasks restored successfully',
      restoredCount: result.modifiedCount,
    };
  }
}
