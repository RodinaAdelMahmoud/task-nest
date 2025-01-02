import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';

import { getTaskPipeline, getTasksPipeline } from '../../helpers/task.pipeline.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { addPaginationStages, ModelNames } from '@common';
import {
  ITaskModel,
  TaskNotificationEnum,
  TaskPriorityEnum,
  TaskPriorityScoreEnum,
  TaskStatusEnum,
} from '@common/schemas/mongoose/task';
import { CreateTaskDto } from '../../dto/employee/create-task.dto';
import { ListTasksQueryDto, TaskSortEnum, TaskTypeEnum } from '../../dto/employee/list-my-tasks.dto';
import { UpdateTaskStatusDto } from '../../dto/employee/change-task-status.dto';
import { UpdateTaskDto } from '../../dto/employee/update-task.dto';
import { errorManager } from '../../shared/config/error.config';

@Injectable()
export class EmployeeTasksService {
  constructor(@Inject(ModelNames.TASK) private taskModel: ITaskModel, private readonly eventEmitter: EventEmitter2) {}

  // async createNewAssignedTask(employeeId: string, body: CreateTaskDto) {
  //   const assigner = await this.employeeModel.findById(employeeId);

  //   let defaultRoleDetails = null;
  //   if (assigner.defaultRole) {
  //     defaultRoleDetails = await this.employeeRoleModel.findById(assigner.defaultRole).select({});
  //   }

  //   if (body.dueDate < new Date()) {
  //     throw new ConflictException(errorManager.INVALID_DATE);
  //   }

  //   const organization = await this.organisationModel.findById(body.organisation).exec();
  //   if (!organization) {
  //     throw new BadRequestException(errorManager.INVALID_ORGANISATION);
  //   }

  //   for (const employee of body.issuedTo) {
  //     if (employee._id.toString() !== assigner._id.toString()) {
  //       if (!defaultRoleDetails.permissions['tasks']['create']) {
  //         throw new ForbiddenException(errorManager.NO_PERMISSION_TO_ASSIGN);
  //       }
  //     }
  //   }

  //   const newTask = new this.taskModel({
  //     ...body,
  //     issuedBy: new Types.ObjectId(employeeId),
  //     priority: {
  //       level: TaskPriorityEnum[body.priority.toUpperCase()],
  //       score: TaskPriorityScoreEnum[body.priority.toUpperCase()],
  //     },
  //   });

  //   const savedTask = await newTask.save();

  //   return savedTask;
  // }

  // async paginateTasks(employeeId: string, query: ListTasksQueryDto) {
  //   const { page, limit, taskType, sortBy } = query;
  //   const assignerOrganisations = await this.employeeModel.findById(employeeId).select('organisations').lean();

  //   const matchQuery: PipelineStage[] = [
  //     {
  //       $match: {
  //         ...(taskType
  //           ? taskType === TaskTypeEnum.ASSIGNED_TO_ME
  //             ? { issuedTo: new Types.ObjectId(employeeId) }
  //             : taskType === TaskTypeEnum.ASSIGNED_BY_ME
  //             ? { issuedBy: new Types.ObjectId(employeeId) }
  //             : {}
  //           : {
  //               organisation: {
  //                 $in: (assignerOrganisations as any).organisations.map((orgId) => new Types.ObjectId(orgId)),
  //               },
  //             }),
  //         $and: [
  //           {
  //             $expr: {
  //               $ne: ['$issuedTo', '$issuedBy'], // Ensure issuedTo is not the same as issuedBy
  //             },
  //           },
  //           {
  //             $or: [
  //               {
  //                 issuedTo: new Types.ObjectId(employeeId), // Task issued to the employee
  //               },
  //               {
  //                 issuedBy: new Types.ObjectId(employeeId), // Task issued by the employee
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //   ];

  //   const [data, [{ total = 0 } = {}]] = await Promise.all([
  //     this.taskModel.aggregate([
  //       ...matchQuery,
  //       {
  //         $sort: {
  //           ...(sortBy &&
  //             sortBy === TaskSortEnum.PRIORITY && {
  //               'priority.score': -1,
  //             }),
  //           ...(sortBy &&
  //             sortBy === TaskSortEnum.DUE_DATE && {
  //               dueDate: 1,
  //             }),
  //           _id: -1,
  //         },
  //       },
  //       ...addPaginationStages({ page, limit }),
  //       ...getTasksPipeline(),
  //     ]),
  //     this.taskModel.aggregate([...matchQuery]).count('total'),
  //   ]);

  //   const pages = Math.ceil(total / limit);

  //   return { data, total, limit, pages, page };
  // }

  // async getTaskByTaskId(employeeId: string, taskId: string) {
  //   const [task] = await this.taskModel.aggregate([
  //     {
  //       $match: {
  //         _id: new Types.ObjectId(taskId),
  //       },
  //     },

  //     ...getTaskPipeline(),
  //   ]);

  //   if (!task) {
  //     throw new NotFoundException(errorManager.TASK_NOT_FOUND);
  //   }

  //   return task;
  // }

  // async updateSelfTask(employeeId: string, taskId: string, body: UpdateTaskDto) {
  //   const task = await this.taskModel.findOne({
  //     $or: [{ issuedTo: employeeId }, { issuedBy: employeeId }],
  //     _id: taskId,
  //   });

  //   if (!task) {
  //     throw new NotFoundException(errorManager.TASK_NOT_FOUND);
  //   }

  //   task.set({
  //     ...body,
  //     ...(body.priority && {
  //       priority: {
  //         level: TaskPriorityEnum[body.priority.toUpperCase()],
  //         score: TaskPriorityScoreEnum[body.priority.toUpperCase()],
  //       },
  //     }),
  //   });
  //   await task.save();

  //   if (body.issuedTo) {
  //     this.eventEmitter.emit(TaskNotificationEnum.TASK_ASSIGNED_TO_YOU, task);
  //   }

  //   return task;
  // }

  // async updateTaskStatus(employeeId: string, taskId: string, body: UpdateTaskStatusDto) {
  //   const task = await this.taskModel.findOne({
  //     $or: [{ issuedTo: employeeId }, { issuedBy: employeeId }],
  //     _id: taskId,
  //   });

  //   if (!task) {
  //     throw new NotFoundException(errorManager.TASK_NOT_FOUND);
  //   }

  //   task.set(body);
  //   await task.save();

  //   return task;
  // }
}
