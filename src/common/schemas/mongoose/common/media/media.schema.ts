import { Schema } from 'mongoose';
import { Media } from './media.type';
import { MediaTypeEnum } from './media.enum';

export const MediaSchema = new Schema<Media>(
  {
    type: {
      type: String,
      enum: MediaTypeEnum,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);
