import { Connection, Schema } from 'mongoose';
import { PrioritySubSchema } from './sub-schema';
import { TaskStatusEnum } from './task.enum';
import { ITaskModel, Task } from './task.type';
import { ModelNames } from '@common/constants';
import { validateSchema } from '@common/helpers/mongoose-schema-validation.helper';
import { BaseSchema } from '../base/base-schema';

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

    // notes: {
    //   type: [String],
    //   required: false,
    // },

    dueDate: {
      type: Date,
      required: true,
    },

    issuedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelNames.EMPLOYEE,
    },

    issuedTo: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: ModelNames.EMPLOYEE,
      },
    ],

    // region: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: ModelNames.REGION,
    // },

    priority: {
      type: PrioritySubSchema,
      required: true,
    },

    referenceUrl: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      required: false,
      enum: TaskStatusEnum,
      default: TaskStatusEnum.TO_DO,
    },

    organisation: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelNames.ORGANISATION, // Reference to the admin managing the office
    },

    ...BaseSchema,
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
