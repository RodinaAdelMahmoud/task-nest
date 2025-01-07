import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserRegisterDto } from './dto/register.dto';
import { UserLoginEmailDto } from './dto/login-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CustomResponse, IsPrivateAuthOrPublic, Persona } from '@common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserLoginEmailGuard, UserRefreshTokenGuard } from './guards';
import { HydratedDocument } from 'mongoose';
import { IUserInstanceMethods, User } from '@common/schemas/mongoose/user';
@ApiTags('Auth - User')
@Controller()
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  // Register Endpoint
  @Post('register')
  @IsPrivateAuthOrPublic()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() userRegisterDto: UserRegisterDto) {
    const user = await this.userAuthService.register(userRegisterDto);
    return { message: 'User registered successfully', user };
  }

  // Login Endpoint
  @IsPrivateAuthOrPublic()
  @UseGuards(UserLoginEmailGuard)
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

  // Forget Password Endpoint
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
  // Verify Forget Password Endpoint
  @IsPrivateAuthOrPublic()
  @Post('public/verify-forget-password-email')
  async verifyForgetPasswordEmail(@Body() body: VerifyEmailDto) {
    const accessToken = await this.userAuthService.verifyForgetPasswordEmail(body);

    return new CustomResponse().success({
      payload: { data: { accessToken } },
    });
  }
  // Reset Password Endpoint
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
}
