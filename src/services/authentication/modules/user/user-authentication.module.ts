import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { RefreshTokenStrategy, RefreshTokenStrategyService, RefreshTokenGuard } from '../admin/controllers';
import { UserMongooseModule } from '@common/modules/mongoose/user';
import {
  UserAuthController,
  UserAuthService,
  UserLoginEmailGuard,
  UserRefreshTokenGuard,
  UserJwtDecodeGuard,
} from './controllers';
import { UserLoginEmailStrategy } from './controllers/user-auth/strategies/login-email/login-email.strategy';
import { UserRefreshTokenStrategy } from './controllers/user-auth/strategies/refresh-token/refresh-token-strategy';
import { UserRefreshTokenStrategyService } from './controllers/user-auth/strategies/refresh-token/refresh-token-strategy.service';

@Module({
  imports: [UserMongooseModule, PassportModule.register({ session: false, property: 'persona' })],
  controllers: [UserAuthController],
  providers: [
    UserAuthService,

    RefreshTokenStrategy,
    RefreshTokenStrategyService,
    RefreshTokenGuard,

    UserLoginEmailStrategy,
    UserLoginEmailGuard,
    UserRefreshTokenStrategy,
    UserRefreshTokenStrategyService,
    UserRefreshTokenGuard,

    // -----
    UserJwtDecodeGuard,
  ],
})
export class UserAuthenticationModule {}
