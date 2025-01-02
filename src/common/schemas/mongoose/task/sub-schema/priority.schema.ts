import { Schema } from 'mongoose';
import { Priority } from './priority.type';
import { TaskPriorityEnum, TaskPriorityScoreEnum } from '../task.enum';

export const PrioritySubSchema = new Schema<Priority>(
  {
    level: {
      type: String,
      enum: TaskPriorityEnum,
      default: TaskPriorityEnum.MEDIUM,
      required: true,
    },

    score: {
      type: Number,
      enum: TaskPriorityScoreEnum,
      default: TaskPriorityScoreEnum.MEDIUM,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: false,
  },
);
