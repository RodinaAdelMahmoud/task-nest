import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

import { UserRefreshTokenGuard } from './guards/user-refresh-token.guard';
import { UserLoginEmailGuard } from './guards/user-login-email.guard';

import { UserJwtDecodeGuard } from './guards/user-jwt.guard';
import { Persona, CustomResponse, IsPrivateAuthOrPublic } from '@common';
import { User, IUserInstanceMethods } from '@common/schemas/mongoose/user';
import { ForgetPasswordDto } from '../../../admin/controllers/admin-auth/dto/forget-password.dto';
import { LoginEmailDto } from '../../../admin/controllers/admin-auth/dto/login-email.dto';
import { ResetPasswordDto } from '../../../admin/controllers/admin-auth/dto/reset-password.dto';
import { VerifyEmailDto } from '../../../admin/controllers/admin-auth/dto/verify-email.dto';
import { IRefreshTokenPayload } from '../../../admin/controllers/admin-auth/strategies/refresh-token/refresh-token-strategy-payload.interface';
import { UserSuspendedGuard } from './guards';
import { UserLoginEmailDto } from './dto/login-email.dto';
import { UserAuthService } from './user-auth.service';

@ApiTags('Auth - User')
@Controller()
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @IsPrivateAuthOrPublic()
  @UseGuards(UserLoginEmailGuard, UserSuspendedGuard)
  @Post('public/login-email')
  async loginUserByEmail(
    @Persona() user: HydratedDocument<User, IUserInstanceMethods>,
    @Body() body: UserLoginEmailDto,
  ) {
    const loginPayload = await this.userAuthService.loginUser(body, user);

    return new CustomResponse().success({
      payload: { data: loginPayload },
    });
  }

  @ApiBearerAuth()
  @UseGuards(UserRefreshTokenGuard)
  @Post('private-auth/refresh-token')
  async refreshToken(@Persona() payload: IRefreshTokenPayload) {
    const user = await this.userAuthService.refreshUserTokens(payload);

    return new CustomResponse().success({
      payload: { data: user },
      localizedMessage: {
        en: 'Token refreshed successfully',
        ar: 'تم تحديث الرقم السري بنجاح',
      },
      event: 'TOKEN_REFRESHED_SUCCESS',
    });
  }

  @IsPrivateAuthOrPublic()
  @Get('public/forget-password')
  async forgetPassword(@Query() query: ForgetPasswordDto) {
    await this.userAuthService.forgetPassword(query);

    return new CustomResponse().success({
      localizedMessage: {
        en: 'Password reset email successfully sent',
        ar: 'تم إرسال البريد الإلكتروني الخاص بإعادة تعيين كلمة المرور بنجاح',
      },
      event: 'FORGET_PASSWORD_EMAIL_SUCCESS',
    });
  }

  @IsPrivateAuthOrPublic()
  @Post('public/verify-forget-password-email')
  async verifyForgetPasswordEmail(@Body() body: VerifyEmailDto) {
    const accessToken = await this.userAuthService.verifyForgetPasswordEmail(body);

    return new CustomResponse().success({
      payload: { data: { accessToken } },
    });
  }

  @IsPrivateAuthOrPublic()
  @Post('public/reset-password')
  async resetForgetPassword(@Body() body: ResetPasswordDto) {
    const user = await this.userAuthService.resetPassword(body);

    return new CustomResponse().success({
      payload: { data: user },
      localizedMessage: {
        en: 'Password has been successfully reset',
        ar: 'تم إعادة تعيين كلمة المرور بنجاح',
      },
      event: 'RESET_FORGET_PASSWORD_SUCCESS',
    });
  }

  // @ApiBearerAuth()
  // @UseGuards(UserJwtDecodeGuard)
  // @Post('private/logout')
  // async logout(@Persona() userJWT: UserJwtPersona, @Body() body: UserLogoutDto) {
  //   await this.userAuthService.logout(userJWT, body);

  //   return new CustomResponse().success({});
  // }
}
