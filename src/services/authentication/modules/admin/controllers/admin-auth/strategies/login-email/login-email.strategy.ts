import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AdminStatusEnum, CustomError, ErrorType, IAdminModel, ModelNames } from '@common';
import { Strategy } from 'passport-local';

@Injectable()
export class LoginEmailStrategy extends PassportStrategy(Strategy, 'admin-login-email') {
  constructor(@Inject(ModelNames.ADMIN) private adminModel: IAdminModel) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const admin = await this.adminModel.findOne(
      { email: email.toLowerCase() },
      { name: 1, role: 1, email: 1, password: 1, status: 1 },
    );

    if (!admin) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Incorrect email or password',
            ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
          },
          event: 'LOGIN_FAILED',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    if (admin.status === AdminStatusEnum.SUSPENDED) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Your account is suspended',
            ar: 'تم تعليق حسابك',
          },
          event: 'LOGIN_FAILED',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    return admin;
  }
}
