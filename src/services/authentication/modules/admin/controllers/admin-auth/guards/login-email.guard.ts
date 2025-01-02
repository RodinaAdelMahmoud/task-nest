import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { handleAuthGuardRequest } from '@common';

@Injectable()
export class LoginEmailGuard extends AuthGuard('admin-login-email') {
  handleRequest(err: any, admin: any, info: any, context: ExecutionContext, status?: any) {
    return handleAuthGuardRequest(err, admin, info, context, status);
  }
}
