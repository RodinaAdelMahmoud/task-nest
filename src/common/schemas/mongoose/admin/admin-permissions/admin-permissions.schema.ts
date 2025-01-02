import { Schema, SchemaDefinition, SchemaDefinitionType } from 'mongoose';
import { AdminPermissionOperations, AdminResourceOperationsEnum } from './admin-operations.type';
import { AdminResourcesEnum } from './admin-resources.enum';
import { AdminPermissions } from './admin-permissions.type';

export const AdminPermissionOperationSchema = new Schema<AdminPermissionOperations>(
  {
    ...(() => {
      const obj: SchemaDefinition<SchemaDefinitionType<AdminPermissionOperations>> = Object.create({});
      Object.values(AdminResourceOperationsEnum).forEach((operation) => {
        obj[operation] = { type: Boolean, required: false };
      });
      return obj;
    })(),
  },
  { _id: false },
);

export const AdminPermissionSchema = new Schema<AdminPermissions>(
  {
    [AdminResourcesEnum.ADMINS]: {
      type: AdminPermissionOperationSchema,
      required: true,
      default: {
        [AdminResourceOperationsEnum.CREATE]: false,
        [AdminResourceOperationsEnum.READ]: false,
        [AdminResourceOperationsEnum.UPDATE]: false,
        [AdminResourceOperationsEnum.DELETE]: false,
        [AdminResourceOperationsEnum.FILTER]: false,
      },
    },

    [AdminResourcesEnum.ADMIN_ROLES]: {
      type: AdminPermissionOperationSchema,
      required: true,
      default: {
        [AdminResourceOperationsEnum.CREATE]: false,
        [AdminResourceOperationsEnum.READ]: false,
        [AdminResourceOperationsEnum.UPDATE]: false,
        [AdminResourceOperationsEnum.DELETE]: false,
        [AdminResourceOperationsEnum.FILTER]: false,
      },
    },

    
  },
  { _id: false },
);
