import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { Connection, HydratedDocument, Schema } from 'mongoose';
import { UserEventsEnum, UserStatusEnum } from './user.enum';
import { IUserInstanceMethods, IUserModel, User } from './user.type';
import * as moment from 'moment';
import { ModelNames } from '@common/constants';
import { validateSchema } from '@common/helpers/mongoose-schema-validation.helper';
import { BaseSchema } from '../base/base-schema';
import { LocalizedTextSchema } from '../common/localized-text';

export const UserSchema = new Schema<User, IUserModel, IUserInstanceMethods>(
  {
    email: {
      type: String,
      required: true,
    },

    username: {
      type: LocalizedTextSchema(),
      // required: true,
    },

    birthDate: {
      type: Date,
    },

    // idNumber: {
    //   type: String,
    //   required: false,
    // },

    phoneNumber: { type: String, required: false },
    additionalPhoneNumber: { type: String, required: false },

    profilePictureUrl: {
      type: String,
      required: false,
    },

    nationality: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.NATIONALITY,
      required: false,
    },

    country: {
      type: Schema.Types.ObjectId,
      ref: ModelNames.COUNTRY,
      required: false,
    },

    password: {
      type: String,
      required: true,
    },

    passwordReset: {
      type: Boolean,
      required: false,
      default: false,
    },

    status: {
      type: String,
      enum: UserStatusEnum,
      default: UserStatusEnum.ACTIVE,
    },

    organisations: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelNames.ORGANISATION,
        required: true,
      },
    ],

    lastLogin: {
      type: Date,
      required: false,
      default: null,
    },

    mainAddress: {
      type: LocalizedTextSchema(),
      required: false,
    },

    ...BaseSchema,
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

export function userSchemaFactory(connection: Connection, eventEmitter: EventEmitter2) {
  UserSchema.index({ email: 1 });
  UserSchema.index({ username: 1 });

  UserSchema.pre('validate', async function () {
    await validateSchema(this, User);
  });

  UserSchema.pre('save', async function (next) {
    if (this.birthDate) {
      // Example input formats
      const inputFormats = ['MM-DD-YYYY', 'YYYY-MM-DD', moment.ISO_8601];

      // Normalize to UTC
      const normalizedDate = moment(this.birthDate, inputFormats, true).utc(true);

      if (normalizedDate.isValid()) {
        this.birthDate = normalizedDate.toDate();
        console.log(this.birthDate);
      } else {
        next(new Error('Invalid birth date'));
        return;
      }
    }
    next();
  });

  UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  UserSchema.pre('save', async function () {
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
