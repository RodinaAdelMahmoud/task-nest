import { Schema } from 'mongoose';
import { AdminRoleSubSchemaType } from './admin-role.type';
import { ModelNames } from '@common/constants';
import { AdminPermissionSchema } from '../../admin-permissions';
import { LocalizedTextSchema } from '@common/schemas/mongoose/common/localized-text';

export const AdminRoleSubSchema = new Schema<AdminRoleSubSchemaType>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.ADMIN_ROLE,
      required: true,
    },
    name: {
      type: LocalizedTextSchema(),
      required: true,
    },
    permissions: {
      type: AdminPermissionSchema,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: false,
  },
);
