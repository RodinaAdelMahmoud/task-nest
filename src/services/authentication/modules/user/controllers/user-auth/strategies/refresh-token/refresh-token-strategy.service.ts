import { RedisService } from '@songkeys/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserBaseAuthService } from './base-user-auth.service';
import { ModelNames, AppConfig } from '@common';
import { IUserModel } from '@common/schemas/mongoose/user';
import { IRefreshTokenPayload } from 'src/services/authentication/modules/admin/controllers/admin-auth/strategies/refresh-token/refresh-token-strategy-payload.interface';

@Injectable()
export class UserRefreshTokenStrategyService extends UserBaseAuthService {
  constructor(
    @Inject(ModelNames.USER) private _userModel: IUserModel,
    private readonly _appConfig: AppConfig,
    private readonly _jwtService: JwtService,
    private readonly _redisService: RedisService,
  ) {
    super(_userModel, _appConfig, _jwtService, _redisService);
  }

  async validateUserSession(payload: IRefreshTokenPayload) {
    const { _id, sessionId } = payload;

    const userSessions = await this.redis.lrange(_id, 0, -1);

    if (!userSessions.includes(sessionId)) {
      return null;
    }

    return sessionId;
  }
}
