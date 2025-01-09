import { ModelNames, CustomError, ErrorType, UserJwtPersona } from '@common';
import { IUserModel } from '@common/schemas/mongoose/user';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Inject } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserSuspendedGuard implements CanActivate {
  constructor(@Inject(ModelNames.USER) private userModel: IUserModel) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const userPersona = <UserJwtPersona>request.persona;

    const user = await this.userModel.findById(userPersona._id);

    if (!user) {
      throw new ForbiddenException(
        new CustomError({
          localizedMessage: {
            en: 'User not found',
            ar: 'لم يتم العثور على المستخدم',
          },
          event: 'FORBIDDEN',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    // if (user.status === UserStatusEnum.SUSPENDED) {
    //   throw new ForbiddenException(
    //     new CustomError({
    //       localizedMessage: {
    //         en: 'User is suspended',
    //         ar: 'تم تعليق حساب المستخدم',
    //       },
    //       event: 'FORBIDDEN',
    //       errorType: ErrorType.UNAUTHORIZED,
    //     }),
    //   );
    // }

    return true;
  }
}
