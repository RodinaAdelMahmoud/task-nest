import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRefreshTokenStrategyService } from './refresh-token-strategy.service';
import { AppConfig, CustomError, ErrorType } from '@common';
import { IRefreshTokenPayload } from 'src/services/authentication/modules/admin/controllers/admin-auth/strategies/refresh-token/refresh-token-strategy-payload.interface';

@Injectable()
export class UserRefreshTokenStrategy extends PassportStrategy(Strategy, 'user-refresh-token') {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly userRefreshTokenStrategyService: UserRefreshTokenStrategyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig.USER_JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: IRefreshTokenPayload) {
    const session = this.userRefreshTokenStrategyService.validateUserSession(payload);

    if (!session) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Unfortunately, your session is expired',
            ar: 'للأسف ، جلستك منتهي',
          },
          event: 'REFRESH_TOKEN_FAILED',
          errorType: ErrorType.UNAUTHORIZED,
        }),
      );
    }

    return payload;
  }
}
