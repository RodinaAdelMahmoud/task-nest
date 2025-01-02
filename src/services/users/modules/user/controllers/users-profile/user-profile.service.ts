import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PipelineStage, Types } from 'mongoose';

import { Redis } from 'ioredis';
import { RedisService } from '@songkeys/nestjs-redis';
import {
  ModelNames,
  AwsSESService,
  addPaginationStages,
  BasePaginationQuery,
  UserJwtPersona,
  CustomError,
  ErrorType,
  AppConfig,
  AwsS3Service,
  GetImageDocumentPreSignedUrlQueryDto,
  GetImagePreSignedUrlQueryDto,
} from '@common';
import { IUserModel, UserStatusEnum, User } from '@common/schemas/mongoose/user';

import { errorManager } from '../shared/config/error.config';
import * as crypto from 'crypto';
import { escapeRegExp } from 'lodash';

import { ChangeUserPasswordDto } from '../shared/dto/employees-profile/change-password.dto';
import { EditProfileDto } from '../shared/dto/employees-profile/edit-profile.dto';

@Injectable()
export class UserProfilesService {
  private redis: Redis;

  constructor(
    @Inject(ModelNames.USER) private userModel: IUserModel,

    private readonly sesService: AwsSESService,
    private readonly redisService: RedisService,
    private readonly appConfig: AppConfig,
    private readonly s3Service: AwsS3Service,
  ) {
    this.redis = this.redisService.getClient();
  }

  // async getUserProfile(userId: string) {
  //   const user: User & {
  //     _id: Types.ObjectId;
  //     // profileCompletionPercentage?: number;
  //   } = await this.getSelfProfile(userId);

  //   if (!user) {
  //     throw new NotFoundException(errorManager.EMPLOYEE_NOT_FOUND);
  //   }

  //   return user;
  // }

  // public async editProfile(userId: string, body: EditProfileDto) {
  //   const { profilePictureUrl } = body;

  //   const user = await this.userModel.findById(userId);

  //   if (!user) {
  //     throw new NotFoundException(errorManager.EMPLOYEE_NOT_FOUND);
  //   }

  //   user.set(body);

  //   await user.save();

  //   return this.getSelfProfile(userId);
  // }

  // private async getSelfProfile(userId: string) {
  //   const user = await this.userModel
  //     .findById(userId)
  //     .select('-password')
  //     .populate([
  //       {
  //         path: 'country',
  //         select: {
  //           name: 1,
  //           dialCode: 1,
  //           countryCode: 1,
  //         },
  //       },

  //       {
  //         path: 'nationality',
  //         select: {
  //           name: 1,
  //           countryCode: 1,
  //         },
  //       },
  //     ])
  //     .populate({ path: 'organisations' })
  //     .lean();

  //   return user;
  // }

  // async changePassword(userId: string, body: ChangeUserPasswordDto) {
  //   const { oldPassword, newPassword } = body;
  //   const user = await this.userModel.findById(userId);

  //   if (!user) {
  //     throw new NotFoundException(errorManager.EMPLOYEE_NOT_FOUND);
  //   }

  //   const isPasswordMatched = await user.comparePassword(oldPassword);

  //   if (!isPasswordMatched) {
  //     throw new ForbiddenException(errorManager.PASSWORD_MISSMATCH);
  //   }

  //   user.set({ password: newPassword });

  //   await user.save();

  //   const updatedUser = await this.userModel
  //     .findById(userId)
  //     .select({})
  //     .populate([
  //       {
  //         path: 'country',
  //         select: {
  //           name: 1,
  //           dialCode: 1,
  //           countryCode: 1,
  //         },
  //       },

  //       {
  //         path: 'nationality',
  //         select: {
  //           name: 1,
  //           countryCode: 1,
  //         },
  //       },
  //     ])
  //     .populate({ path: 'organisations' })
  //     .lean();

  //   return updatedUser;
  // }

  // async generatePresignedUrl(userId: string, { filename }: GetImagePreSignedUrlQueryDto) {
  //   const fileExtension = filename.split('.').pop();

  //   if (!fileExtension) {
  //     throw new BadRequestException(errorManager.FILE_EXTENSION_REQUIRED);
  //   }

  //   const revisedFilename = `user-profile-${userId}-${Date.now()}.${fileExtension}`;
  //   const filePath = `${userId}/profile/${revisedFilename}`;
  //   const preSignedUrl = await this.s3Service.generatePresignedUrl(filePath);
  //   const cloudFrontUrl = `${this.appConfig.MEDIA_DOMAIN}/${filePath}`;

  //   return {
  //     preSignedUrl,
  //     cloudFrontUrl,
  //   };
  // }
}
