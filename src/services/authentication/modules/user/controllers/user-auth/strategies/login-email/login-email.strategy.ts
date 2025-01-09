import { ModelNames, CustomError, ErrorType } from '@common';
import { IUserModel } from '@common/schemas/mongoose/user';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class UserLoginEmailStrategy extends PassportStrategy(Strategy, 'user-login-email') {
  constructor(@Inject(ModelNames.USER) private userModel: IUserModel) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    console.log('Incoming email:', email);
    const user = await this.userModel.findOne({ email: email.toLowerCase() }, { email: 1, password: 1 });
    console.log('User found:', user);

    if (!user) {
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

    return user;
  }
}
