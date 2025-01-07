import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { Connection, HydratedDocument, Schema } from 'mongoose';
import { UserEventsEnum } from './user.enum';
import { IUserInstanceMethods, IUserModel, User } from './user.type';
import * as moment from 'moment';
import { ModelNames } from '@common/constants';
import { validateSchema } from '@common/helpers/mongoose-schema-validation.helper';

export const UserSchema = new Schema<User, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        if (ret.birthDate instanceof Date) {
          ret.birthDate = moment(ret.birthDate).utc().toISOString();
        }
      },
      getters: true,
    },
  },
);

UserSchema.index({ email: 1 });
UserSchema.index({ code: 1 });

export function userSchemaFactory(connection: Connection, eventEmitter: EventEmitter2) {
  UserSchema.pre('validate', async function () {
    await validateSchema(this, User);
  });

  UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  });

  UserSchema.methods.comparePassword = async function (this: HydratedDocument<User>, password: string) {
    return bcrypt.compare(password, this.password);
  };

  UserSchema.methods.deleteDoc = async function (this: HydratedDocument<User>) {
    await this.deleteOne();
    eventEmitter.emit(UserEventsEnum.DELETE_DOC, this);
  };

  const userModel = connection.model(ModelNames.USER, UserSchema);

  return userModel;
}
