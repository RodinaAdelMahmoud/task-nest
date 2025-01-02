import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RedisService } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { HydratedDocument, Model, Types } from 'mongoose';
import { GetMediaPreSignedUrlQueryDto } from 'src/common/dtos/get-pre-signed-url.dto';

import { v4 as uuidV4, v5 as uuidV5 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { ModelNames, AppConfig, AwsSESService, AwsS3Service, CustomError, ErrorType } from '@common';
import { IUserModel, User, IUserInstanceMethods, UserStatusEnum } from '@common/schemas/mongoose/user';
import { ForgetPasswordDto } from '../../../admin/controllers/admin-auth/dto/forget-password.dto';
import { LoginEmailDto } from '../../../admin/controllers/admin-auth/dto/login-email.dto';
import { ResetPasswordDto } from '../../../admin/controllers/admin-auth/dto/reset-password.dto';
import { VerifyEmailDto } from '../../../admin/controllers/admin-auth/dto/verify-email.dto';
import { ITempAccessTokenPayload } from '../../../admin/controllers/admin-auth/interfaces/temp-access-token.interface';
import { IRefreshTokenPayload } from '../../../admin/controllers/admin-auth/strategies/refresh-token/refresh-token-strategy-payload.interface';
import { errorManager } from 'src/services/authentication/shared/config/errors.config';
import { UserLoginEmailDto } from './dto/login-email.dto';

@Injectable()
export class UserAuthService {
  protected readonly redis: Redis;

  constructor(
    @Inject(ModelNames.USER) private userModel: IUserModel,
    // @Inject(ModelNames.USER_FCM_TOKEN) private userFCMTokenModel: IUserFCMTokenModel,
    // private readonly userFCMService: UserFCMService,
    // private readonly logger: CustomLoggerService,
    private readonly appConfig: AppConfig,
    private readonly jwtService: JwtService,
    private readonly sesService: AwsSESService,
    private readonly redisService: RedisService,
    private readonly s3Service: AwsS3Service,
  ) {
    this.redis = this.redisService.getClient();
  }

  async loginUser(payload: UserLoginEmailDto, user: HydratedDocument<User, IUserInstanceMethods>) {
    const { email, password } = payload;
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException(errorManager.INCORRECT_EMAIL_OR_PASSWORD);
    }
    const userWithPassReset = await this.userModel.findOne({ email }).select('+passwordReset');

    const _user = userWithPassReset.toObject();

    if (!_user.passwordReset) {
      // Redirect user to password reset page
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'You need to reset your password.',
            ar: 'يجب عليك إعادة تعيين كلمة المرور.',
          },
          event: 'PASSWORD_RESET_REQUIRED',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    if (_user.status !== UserStatusEnum.ACTIVE) {
      // Redirect user to password reset page
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Your account is not activated yet',
            ar: 'لم يتم تنشيط حسابك بعد.',
          },
          event: 'ACCOUNT_NOT_ACTIVE',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    return this.handleUserLoginAndGenerateTokens(user._id);
  }

  async refreshUserTokens(payload: IRefreshTokenPayload) {
    const { _id: userId, sessionId } = payload;

    const [userSessions, user] = await Promise.all([
      this.redis.lrange(userId, 0, -1),
      this.userModel.findById(userId, { email: 1 }),
    ]);

    if (!userSessions?.length || !userSessions?.includes(sessionId)) {
      throw new UnauthorizedException(errorManager.INVALID_ACCESS_TOKEN);
    }

    return {
      ...user.toJSON(),
      ...(await this.generateTokens(user)),
    };
  }

  async forgetPassword({ email }: ForgetPasswordDto) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException(errorManager.USER_NOT_FOUND);
    }

    const attempts = await this.redis.get(`${email}-trials`);

    if (Number(attempts) >= 30) {
      throw new ForbiddenException(errorManager.MAX_ATTEMPTS_EXCEEDED);
    }

    const code = await this.generateEmailVerificationCode(email, attempts);

    await this.sesService.sendEmail({
      emails: email,
      subject: 'Reset Your Task Account Password',
      body: `Your verification code is ${code}. This code expires in 10 minutes.`,
    });
  }

  async verifyForgetPasswordEmail({ code, email }: VerifyEmailDto) {
    const storedCode = await this.redis.get(`${email}-verify`);

    if (!storedCode) {
      throw new UnauthorizedException(errorManager.INCORRECT_EMAIL);
    }

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(errorManager.INCORRECT_EMAIL);
    }

    await this.validateEmailVerificationCode({ email, code });

    return this.generateTempAccessToken(user._id?.toString());
  }

  async resetPassword({ accessToken, newPassword }: ResetPasswordDto) {
    const { _id }: ITempAccessTokenPayload = this.validateTempAccessToken(accessToken);

    const user = await this.userModel.findById(_id);

    if (!user) {
      throw new UnauthorizedException(errorManager.INVALID_ACCESS_TOKEN);
    }

    user.set({
      password: newPassword,
      passwordReset: true,
    });

    await user.save();
  }

  private validateTempAccessToken(accessToken: string) {
    const payload = this.jwtService.verify(accessToken, {
      secret: this.appConfig.USER_JWT_SECRET,
    });

    if (!payload?.temp) {
      throw new UnauthorizedException(errorManager.INVALID_ACCESS_TOKEN);
    }

    return payload;
  }

  public async generateEmailVerificationCode(email: string, attempts?: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await Promise.all([
      this.redis.set(`${email}-trials`, (Number(attempts) || 0) + 1, 'EX', 3600), // 1 hour
      this.redis.set(`${email}-verify`, code, 'EX', 600), // 10 minutes
    ]);

    return code;
  }

  public async validateEmailVerificationCode({ email, code }: VerifyEmailDto) {
    const storedCode = await this.redis.get(`${email}-verify`);

    if (storedCode !== code) {
      throw new UnauthorizedException(errorManager.INCORRECT_CODE);
    }

    await Promise.all([this.redis.del(`${email}-verify`), this.redis.del(`${email}-trials`)]);
  }

  // BASE AUTH

  async handleUserLoginAndGenerateTokens(userId: string | Types.ObjectId) {
    const user = await this.userModel.findById(userId).select({ _id: 1, email: 1, passwordReset: 1, lastLogin: 1 });

    if (user.lastLogin === null) {
      user.set({ lastLogin: new Date() });
      await user.save();

      user.lastLogin = null;

      return {
        user,
        ...(await this.generateTokens(user)),
      };
    }

    user.set({ lastLogin: new Date() });
    await user.save();

    return {
      user,
      ...(await this.generateTokens(user)),
    };
  }

  async generateAccessToken(user: HydratedDocument<User>, existingSessionId?: string) {
    const userId = user._id;

    let sessionId = existingSessionId;
    // Generate new session id and save it to redis
    if (!existingSessionId) sessionId = await this.createSession(user);

    const token = this.jwtService.sign(
      { _id: userId, sessionId },
      {
        secret: this.appConfig.USER_JWT_SECRET,
        expiresIn: this.appConfig.USER_JWT_EXPIRY,
      },
    );

    return {
      accessToken: token,
      sessionId: sessionId,
    };
  }

  async createSession(user: HydratedDocument<User>) {
    const session = uuidV5(uuidV4(), uuidV4());

    await this.redis.lpush(user._id?.toString(), session);

    return session;
  }

  async generateRefreshToken(user: HydratedDocument<User>, sessionId: string) {
    const refreshToken = this.jwtService.sign(
      { sessionId, _id: user._id },
      {
        secret: this.appConfig.USER_JWT_REFRESH_SECRET,
        expiresIn: this.appConfig.USER_JWT_REFRESH_EXPIRY || 7200, // 2 hours
      },
    );

    return {
      refreshToken,
    };
  }

  async generateTokens(user: HydratedDocument<User>) {
    const { accessToken, sessionId: newSessionId } = await this.generateAccessToken(user);

    const { refreshToken } = await this.generateRefreshToken(user, newSessionId);

    return {
      accessToken,
      refreshToken,
    };
  }

  generateTempAccessToken(userId: string) {
    const payload: ITempAccessTokenPayload = {
      _id: userId,
      temp: true,
    };

    return this.jwtService.sign(payload, {
      secret: this.appConfig.USER_JWT_SECRET,
      expiresIn: '10m',
    });
  }

  async generatePresignedUrl({ filename }: GetMediaPreSignedUrlQueryDto) {
    const fileExtension = filename.split('.').pop();

    if (!fileExtension) {
      throw new BadRequestException(errorManager.FILE_EXTENSION_REQUIRED);
    }

    const userId = this.generateUniqueId(); // Replace this with your logic to generate a unique identifier
    const revisedFilename = `user-profile-${userId}-${Date.now()}.${fileExtension}`;
    const filePath = `${userId}/media/${revisedFilename}`;
    const preSignedUrl = await this.s3Service.generatePresignedUrl(filePath);
    const cloudFrontUrl = `${this.appConfig.MEDIA_DOMAIN}/${filePath}`;

    return {
      preSignedUrl,
      cloudFrontUrl,
    };
  }

  public generateUniqueId(): string {
    const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
    const randomPart = Math.random().toString(36).substring(2, 8); // Random string
    const uniqueId = timestamp + randomPart;

    return uniqueId;
  }

  // async logout(userJWT: UserJwtPersona, { fcmToken }: UserLogoutDto) {
  //   const { _id, sessionId } = userJWT;

  //   if (fcmToken) {
  //     await this.unregisterFCMToken(_id, fcmToken);
  //   }

  //   const removeResult = await this.redis.lrem(_id, 0, sessionId);

  //   if (removeResult === 0) {
  //     throw new UnauthorizedException(
  //       new CustomError({
  //         localizedMessage: {
  //           en: 'Invalid session',
  //           ar: 'جلسة غير صالحة',
  //         },
  //         event: 'INVALID_SESSION',
  //         errorType: ErrorType.UNAUTHORIZED,
  //       }),
  //     );
  //   }
  // }

  // private async unregisterFCMToken(userId: string, fcmToken: string) {
  //   const userFCMToken = await this.userFCMTokenModel.findOne({
  //     user: new Types.ObjectId(userId),
  //     fcmToken,
  //   });
  //   console.log(userFCMToken);
  //   if (!userFCMToken) return;
  //   await userFCMToken.deleteOne();
  // }
}
