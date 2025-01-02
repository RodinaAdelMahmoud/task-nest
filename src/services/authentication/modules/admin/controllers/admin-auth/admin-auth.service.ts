import { RedisService } from '@liaoliaots/nestjs-redis';
import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Admin,
  AppConfig,
  AwsSESService,
  CustomError,
  ErrorType,
  IAdminInstanceMethods,
  IAdminModel,
  IAdminRoleModel,
  ModelNames,
} from '@common';
import { HydratedDocument } from 'mongoose';
import { BaseAuthService } from './base-auth.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ITempAccessTokenPayload } from './interfaces/temp-access-token.interface';
import { IRefreshTokenPayload } from './strategies/refresh-token/refresh-token-strategy-payload.interface';

@Injectable()
export class AdminAuthService extends BaseAuthService {
  constructor(
    @Inject(ModelNames.ADMIN) private _adminModel: IAdminModel,
    @Inject(ModelNames.ADMIN_ROLE) private _adminRole: IAdminRoleModel,
    private readonly _appConfig: AppConfig,
    private readonly _jwtService: JwtService,
    private readonly _redisService: RedisService,
    private readonly sesService: AwsSESService,
  ) {
    super(_adminModel, _appConfig, _jwtService, _redisService);
  }

  async loginAdmin(payload: LoginEmailDto, admin: HydratedDocument<Admin, IAdminInstanceMethods>) {
    const { password, rememberMe } = payload;
    const isPasswordMatched = await admin.comparePassword(password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Incorrect Email or password',
            ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
          },
          event: 'LOGIN_FAILED',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    const _admin = admin.toJSON();

    return {
      ..._admin,
      ...(await this.generateTokens(admin, rememberMe)),
    };
  }

  async refreshAdminTokens(payload: IRefreshTokenPayload, refreshToken: string) {
    const { _id: adminId, sessionId } = payload;

    const [adminSessions, admin] = await Promise.all([
      this.redis.lrange(adminId, 0, -1),

      this.adminModel.findById(adminId, {
        name: 1,
        // phone: 1,
        role: 1,
        email: 1,
        password: 1,
        status: 1,
      }),
    ]);

    if (!adminSessions?.length || !adminSessions?.includes(sessionId)) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Invalid session',
            ar: 'جلسة غير صالحة',
          },
          event: 'INVALID_SESSION',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    return {
      ...admin.toJSON(),
      ...(await this.generateAccessToken(admin, sessionId)),
      refreshToken,
    };
  }

  async forgetPassword({ email }: ForgetPasswordDto) {
    const admin = await this.adminModel.findOne({ email: email.toLowerCase() });

    if (!admin) return;

    const attempts = await this.redis.get(`${email}-trials`);

    if (Number(attempts) >= 3) {
      throw new ForbiddenException(
        new CustomError({
          localizedMessage: {
            en: 'You have exceeded the maximum number of attempts, please try again later',
            ar: 'لقد تجاوزت الحد الأقصى لعدد المحاولات ، يرجى المحاولة مرة أخرى لاحقًا',
          },
          event: 'MAX_ATTEMPTS_EXCEEDED',
          errorType: ErrorType.FORBIDDEN,
        }),
      );
    }

    const code = await this.generateEmailVerificationCode(email.toLowerCase(), attempts);

    await this.sesService.sendEmail({
      emails: email,
      subject: 'Email Verification',
      body: `Your verification code is ${code}. This code expires in 10 minutes.`,
    });
  }

  async verifyForgetPasswordEmail({ code, email }: VerifyEmailDto) {
    const storedCode = await this.redis.get(`${email.toLowerCase()}-verify`);

    if (!storedCode) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Invalid email',
            ar: 'البريد الإلكتروني غير صحيح',
          },
          event: 'INVALID_EMAIL',
          errorType: ErrorType.WRONG_REQUEST,
        }),
      );
    }

    const admin = await this.adminModel.findOne({ email: email.toLowerCase() });

    if (!admin) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Invalid email',
            ar: 'البريد الإلكتروني غير صحيح',
          },
          event: 'INVALID_EMAIL',
          errorType: ErrorType.WRONG_REQUEST,
        }),
      );
    }

    await this.validateEmailVerificationCode({ email: email.toLowerCase(), code });

    return this.generateTempAccessToken(admin._id?.toString());
  }

  async resetPassword({ accessToken, newPassword }: ResetPasswordDto) {
    const { _id }: ITempAccessTokenPayload = this.validateTempAccessToken(accessToken);

    const admin = await this.adminModel.findById(_id);

    if (!admin) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Invalid access token',
            ar: 'رمز الوصول غير صالح',
          },
          event: 'INVALID_ACCESS_TOKEN',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    admin.password = newPassword;

    await admin.save();
  }

  private generateTempAccessToken(adminId: string) {
    const payload: ITempAccessTokenPayload = {
      _id: adminId,
      temp: true,
    };

    return this.jwtService.sign(payload, {
      secret: this.appConfig.ADMIN_JWT_SECRET,
      expiresIn: '10m',
    });
  }

  private validateTempAccessToken(accessToken: string) {
    const payload = this.jwtService.verify(accessToken, {
      secret: this.appConfig.ADMIN_JWT_SECRET,
    });

    if (!payload?.temp) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Invalid access token',
            ar: 'رمز الوصول غير صالح',
          },
          event: 'INVALID_ACCESS_TOKEN',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    return payload;
  }

  private async generateEmailVerificationCode(email: string, attempts?: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await Promise.all([
      this.redis.set(`${email.toLowerCase()}-trials`, (Number(attempts) || 0) + 1, 'EX', 3600), // 1 hour
      this.redis.set(`${email.toLowerCase()}-verify`, code, 'EX', 600), // 10 minutes
    ]);

    return code;
  }

  private async validateEmailVerificationCode({ email, code }: VerifyEmailDto) {
    const storedCode = await this.redis.get(`${email.toLowerCase()}-verify`);

    if (storedCode !== code) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Please enter the correct code.',
            ar: '.بالرجاء إدخال الرمز الصحيح',
          },
          event: 'INCORRECT_CODE',
          errorType: ErrorType.WRONG_REQUEST,
        }),
      );
    }

    await Promise.all([
      this.redis.del(`${email.toLowerCase()}-verify`),
      this.redis.del(`${email.toLowerCase()}-trials`),
    ]);
  }
}
