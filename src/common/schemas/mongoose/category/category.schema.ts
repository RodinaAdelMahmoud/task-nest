import { validateSchema } from '@common/helpers/mongoose-schema-validation.helper';
import { Connection, Schema } from 'mongoose';
import { Category, ICategoryModel } from './category.type';
import { ModelNames } from '@common/constants';
import { CategoryTypeEnum } from './category.enum';

export const CategorySchema = new Schema<Category, ICategoryModel>(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: CategoryTypeEnum,
      default: CategoryTypeEnum.WORK,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    isDeleted: {
      type: Boolean,
      required: true,
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

export function categorySchemaFactory(connection: Connection) {
  CategorySchema.pre('validate', async function () {
    await validateSchema(this, Category);
  });

  const categoryModel = connection.model(ModelNames.CATEGORY, CategorySchema);

  return categoryModel;
}
