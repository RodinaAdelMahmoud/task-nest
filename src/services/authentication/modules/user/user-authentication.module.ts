import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { UserMongooseModule } from '@common/modules/mongoose/user';
import {
  UserAuthController,
  UserAuthService,
  UserLoginEmailGuard,
  UserRefreshTokenGuard,
  UserJwtDecodeGuard,
} from './controllers';
import { UserLoginEmailStrategy } from './controllers/user-auth/strategies/login-email/login-email.strategy';
import { UserRefreshTokenStrategyService } from './controllers/user-auth/strategies/refresh-token/refresh-token-strategy.service';

@Module({
  imports: [UserMongooseModule, PassportModule.register({ session: false, property: 'persona' })],
  controllers: [UserAuthController],
  providers: [
    UserAuthService,

    UserLoginEmailStrategy,
    UserLoginEmailGuard,
    UserRefreshTokenStrategyService,
    UserRefreshTokenGuard,

    UserJwtDecodeGuard,
  ],
})
export class UserAuthenticationModule {}
