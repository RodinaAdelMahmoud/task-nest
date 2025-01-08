import { Schema } from 'mongoose';
import { validateSchema } from '@common/helpers/mongoose-schema-validation.helper';
import { AuditLog } from './audit-log.type';
import { ModelNames } from '@common/constants';

export const AuditLogSchema = new Schema<AuditLog>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelNames.TASK,
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.USER,
    },
    timeStamp: {
      type: Date,
      default: Date.now,
    },
    changeType: {
      type: String,
      required: true,
    },
    oldValue: {
      type: String,
    },
    newValue: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v; // Remove `__v` from JSON output
      },
    },
  },
);

// Factory function to validate schema
export function auditLogSchemaFactory(connection) {
  AuditLogSchema.pre('validate', async function () {
    await validateSchema(this, AuditLog);
  });

  return connection.model(ModelNames.AUDIT_LOG, AuditLogSchema);
}
