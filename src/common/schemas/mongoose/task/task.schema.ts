import { Connection, Schema } from 'mongoose';

import { ITaskModel, Task } from './task.type';
import { ModelNames } from '@common/constants';
import { validateSchema } from '@common/helpers/mongoose-schema-validation.helper';
import { TaskStatusEnum } from './task.enum';
import { TaskPriorityEnum } from '@common/schemas/mongoose/task';

export const TaskSchema = new Schema<Task, ITaskModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: TaskStatusEnum,
      default: TaskStatusEnum.PENDING,
    },
    priority: {
      type: String,
      enum: TaskPriorityEnum,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
      },
    },
  },
);

export function taskSchemaFactory(connection: Connection) {
  TaskSchema.index({ 'priority.score': 1 });
  TaskSchema.index({ dueDate: 1 });

  TaskSchema.pre('validate', async function () {
    await validateSchema(this, Task);
  });

  const taskModel = connection.model(ModelNames.TASK, TaskSchema);

  return taskModel;
}
