import { Module } from '@nestjs/common';
import { AdminJWTStrategy, AdminJwtAuthGuard, AdminMongooseModule, AdminRolesMongooseModule } from '@common';
import {
  AdminAuthController,
  AdminAuthService,
  LoginEmailGuard,
  LoginEmailStrategy,
  RefreshTokenGuard,
  RefreshTokenStrategy,
  RefreshTokenStrategyService,
} from './controllers';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AdminMongooseModule,
    AdminRolesMongooseModule,
    PassportModule.register({ session: false, property: 'persona' }),
  ],
  controllers: [AdminAuthController],
  providers: [
    AdminAuthService,

    // Guards and Strategies
    LoginEmailStrategy,
    LoginEmailGuard,
    RefreshTokenStrategy,
    RefreshTokenStrategyService,
    RefreshTokenGuard,

    // -----
    AdminJwtAuthGuard,
    AdminJWTStrategy,
  ],
})
export class AdminAuthenticationModule {}
