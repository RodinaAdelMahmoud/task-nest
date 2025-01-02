import { handleAuthGuardRequest } from '@common';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserLoginEmailGuard extends AuthGuard('user-login-email') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    return handleAuthGuardRequest(err, user, info, context, status);
  }
}
