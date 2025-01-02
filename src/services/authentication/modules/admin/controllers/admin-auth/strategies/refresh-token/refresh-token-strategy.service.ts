import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfig, IAdminModel, ModelNames } from '@common';
import { BaseAuthService } from '../../base-auth.service';
import { IRefreshTokenPayload } from './refresh-token-strategy-payload.interface';

@Injectable()
export class RefreshTokenStrategyService extends BaseAuthService {
  constructor(
    @Inject(ModelNames.ADMIN) private _adminModel: IAdminModel,
    private readonly _appConfig: AppConfig,
    private readonly _jwtService: JwtService,
    private readonly _redisService: RedisService,
  ) {
    super(_adminModel, _appConfig, _jwtService, _redisService);
  }

  async validateAdminSession(payload: IRefreshTokenPayload) {
    const { _id, sessionId } = payload;

    const adminSessions = await this.redis.lrange(_id, 0, -1);

    if (!adminSessions.includes(sessionId)) {
      return null;
    }

    return sessionId;
  }
}
