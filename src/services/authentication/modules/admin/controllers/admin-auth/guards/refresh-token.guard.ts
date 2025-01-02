import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { handleAuthGuardRequest } from '@common';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('admin-refresh-token') {
  handleRequest(err: any, admin: any, info: any, context: ExecutionContext, status?: any) {
    return handleAuthGuardRequest(err, admin, info, context, status);
  }
}
