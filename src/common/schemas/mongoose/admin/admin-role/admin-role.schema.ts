import { ModelNames } from '@common/constants';
import { validateSchema } from '@common/helpers/mongoose-schema-validation.helper';
import { Connection, Schema } from 'mongoose';
import { AdminRole, IAdminRoleInstanceMethods, IAdminRoleModel } from './admin-role.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminRoleEventsEnum } from './admin-role.enum';
import { BaseSchema } from '@common/schemas/mongoose/base/base-schema';
import { AdminPermissionSchema } from '../admin-permissions';
import { LocalizedTextSchema } from '../../common/localized-text';

export const AdminRoleSchema = new Schema<AdminRole, IAdminRoleModel, IAdminRoleInstanceMethods>(
  {
    name: {
      type: LocalizedTextSchema(),
      required: true,
    },

    permissions: {
      type: AdminPermissionSchema,
      required: true,
    },

    ...BaseSchema,
  },
  {
    timestamps: true,
  },
);

export function AdminRoleSchemaFactory(connection: Connection, eventEmitter: EventEmitter2) {
  AdminRoleSchema.index({ 'name.en': 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
  AdminRoleSchema.index({ 'name.ar': 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });

  AdminRoleSchema.pre('validate', async function () {
    await validateSchema(this, AdminRole);
  });

  AdminRoleSchema.pre('save', async function () {
    // this.wasNew = this.isNew;
  });

  AdminRoleSchema.post('save', async function () {
    // if (this.wasNew) return;

    eventEmitter.emit(AdminRoleEventsEnum.POST_SAVE_UPDATE_ADMIN_ROLES, this);
  });

  const adminRoleModel = connection.model(ModelNames.ADMIN_ROLE, AdminRoleSchema);

  return adminRoleModel;
}
