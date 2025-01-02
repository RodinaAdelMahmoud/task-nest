import { ModelNames } from '@common/constants';
import { validateSchema } from '@common/helpers/mongoose-schema-validation.helper';
import { Schema, Connection, HydratedDocument } from 'mongoose';
import { Admin, IAdminModel, IAdminInstanceMethods } from './admin.type';
import { BaseSchema } from '../base/base-schema';
import { AdminRoleSubSchema } from './admin-subschemas/admin-role';
import * as bcrypt from 'bcrypt';
import { AdminStatusEnum } from './admin.enum';
import { LocalizedTextSchema } from '../common/localized-text';

export const AdminSchema = new Schema<Admin, IAdminModel, IAdminInstanceMethods>(
  {
    name: {
      type: LocalizedTextSchema(),
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePictureUrl: {
      type: String,
      required: false,
    },

    role: {
      type: AdminRoleSubSchema,
      required: true,
    },

    status: {
      type: String,
      enum: AdminStatusEnum,
      default: AdminStatusEnum.ACTIVE,
    },

    ...BaseSchema,
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

export function adminSchemaFactory(connection: Connection) {
  AdminSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
  AdminSchema.index({ _id: 1, 'name.en': 1 });
  AdminSchema.index({ _id: 1, 'name.ar': 1 });
  AdminSchema.index({ 'role._id': 1 });

  AdminSchema.pre('validate', async function () {
    // const adminModel = this.constructor as IAdminModel;

    await validateSchema(this, Admin);

    // // Count total documents and update totalCount
    // const totalDocuments = await adminModel.countDocuments({
    //   status: AdminStatusEnum.ACTIVE,
    // });
    // this.totalCount = totalDocuments;
  });

  AdminSchema.pre('save', async function () {
    if (!this.isModified('password')) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  AdminSchema.methods.comparePassword = async function (this: HydratedDocument<Admin>, password: string) {
    return bcrypt.compare(password, this.password);
  };

  AdminSchema.methods.deleteDoc = async function (this: HydratedDocument<Admin>) {
    this.deletedAt = new Date();
    await this.save();
  };

  const adminModel = connection.model(ModelNames.ADMIN, AdminSchema);

  return adminModel;
}
