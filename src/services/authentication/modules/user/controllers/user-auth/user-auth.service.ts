import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { IUserModel, User, IUserInstanceMethods } from '@common/schemas/mongoose/user';
import { UserRegisterDto } from './dto/register.dto';
import { UserLoginEmailDto } from './dto/login-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtService } from '@nestjs/jwt';
import { ITempAccessTokenPayload } from './../../../../../../../dist/services/authentication/modules/admin/controllers/admin-auth/interfaces/temp-access-token.interface.d';
import { AppConfig, AwsS3Service, AwsSESService, ModelNames } from '@common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { errorManager } from 'src/services/authentication/shared/config/errors.config';
import { v4 as uuidV4, v5 as uuidV5 } from 'uuid';

@Injectable()
export class UserAuthService {
  protected readonly redis: Redis;

  constructor(
    @Inject(ModelNames.USER) private userModel: IUserModel,

    private readonly appConfig: AppConfig,
    private readonly jwtService: JwtService,
    private readonly sesService: AwsSESService,
    private readonly redisService: RedisService,
    private readonly s3Service: AwsS3Service,
  ) {
    this.redis = this.redisService.getClient();
  }
  // User Registration
  async register(userRegisterDto: UserRegisterDto) {
    // Check if user already exists
    const isUser = await this.userModel.findOne({ email: userRegisterDto.email });
    if (isUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    // Insert the user into the database
    await this.userModel.create(userRegisterDto);

    return { message: 'User registered successfully' };
  }

  // User Login
  async loginUser(payload: UserLoginEmailDto, user: HydratedDocument<User, IUserInstanceMethods>) {
    const { email, password } = payload;

    // Compare the provided password with the user's hashed password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException(errorManager.INCORRECT_EMAIL_OR_PASSWORD);
    }

    // Retrieve the user with the passwordReset field
    const userWithPassReset = await this.userModel.findOne({ email }).select('+passwordReset');
    if (!userWithPassReset) {
      throw new UnauthorizedException(errorManager.INCORRECT_EMAIL_OR_PASSWORD);
    }

    // Use the user object to generate tokens
    return this.generateTokens(userWithPassReset); // Pass the entire user document
  }

  // Forget Password (Send Reset Link)
  async forgetPassword({ email }: ForgetPasswordDto) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException(errorManager.USER_NOT_FOUND);
    }

    const attempts = await this.redis.get(`${email}-trials`);

    if (Number(attempts) >= 30) {
      throw new ForbiddenException(errorManager.MAX_ATTEMPTS_EXCEEDED);
    }

    const code = await this.generateEmailVerificationCode(email, attempts);

    await this.sesService.sendEmail({
      emails: email,
      subject: 'Reset Your Task Account Password',
      body: `Your verification code is ${code}. This code expires in 10 minutes.`,
    });
  }
  // Verify Forget Password
  async verifyForgetPasswordEmail({ code, email }: VerifyEmailDto) {
    const storedCode = await this.redis.get(`${email}-verify`);

    if (!storedCode) {
      throw new UnauthorizedException(errorManager.INCORRECT_EMAIL);
    }

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(errorManager.INCORRECT_EMAIL);
    }

    await this.validateEmailVerificationCode({ email, code });

    return this.generateTempAccessToken(user._id?.toString());
  }

  // Reset Password
  async resetPassword({ accessToken, newPassword }: ResetPasswordDto) {
    const { _id }: ITempAccessTokenPayload = this.validateTempAccessToken(accessToken);

    const user = await this.userModel.findById(_id);

    if (!user) {
      throw new UnauthorizedException(errorManager.INVALID_ACCESS_TOKEN);
    }

    user.set({
      password: newPassword,
      passwordReset: true,
    });

    await user.save();
  }

  // Validate Temp Access Token
  private validateTempAccessToken(accessToken: string) {
    const payload = this.jwtService.verify(accessToken, {
      secret: this.appConfig.USER_JWT_SECRET,
    });

    if (!payload?.temp) {
      throw new UnauthorizedException(errorManager.INVALID_ACCESS_TOKEN);
    }

    return payload;
  }
  // Generate Email Verification Code
  public async generateEmailVerificationCode(email: string, attempts?: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await Promise.all([
      this.redis.set(`${email}-trials`, (Number(attempts) || 0) + 1, 'EX', 3600), // 1 hour
      this.redis.set(`${email}-verify`, code, 'EX', 600), // 10 minutes
    ]);

    return code;
  }
  //  Validate Email Verification Code
  public async validateEmailVerificationCode({ email, code }: VerifyEmailDto) {
    const storedCode = await this.redis.get(`${email}-verify`);

    if (storedCode !== code) {
      throw new UnauthorizedException(errorManager.INCORRECT_CODE);
    }

    await Promise.all([this.redis.del(`${email}-verify`), this.redis.del(`${email}-trials`)]);
  }
  // Generate Access Token
  async generateAccessToken(user: HydratedDocument<User>, existingSessionId?: string) {
    const userId = user._id;

    let sessionId = existingSessionId;
    // Generate new session id and save it to redis
    if (!existingSessionId) sessionId = await this.createSession(user);

    const token = this.jwtService.sign(
      { _id: userId, sessionId },
      {
        secret: this.appConfig.USER_JWT_SECRET,
        expiresIn: this.appConfig.USER_JWT_EXPIRY,
      },
    );

    return {
      accessToken: token,
      sessionId: sessionId,
    };
  }
  // Create Session
  async createSession(user: HydratedDocument<User>) {
    const session = uuidV5(uuidV4(), uuidV4());

    await this.redis.lpush(user._id?.toString(), session);

    return session;
  }
  // Generate Tokens
  async generateTokens(user: HydratedDocument<User>) {
    // Generate an access token with a new session ID
    const { accessToken, sessionId: newSessionId } = await this.generateAccessToken(user);

    // Generate a refresh token using the user and session ID
    const { refreshToken } = await this.generateRefreshToken(user, newSessionId);

    return {
      accessToken,
      refreshToken,
    };
  }
  // Generate Refresh Token
  async generateRefreshToken(user: HydratedDocument<User>, sessionId: string) {
    const refreshToken = this.jwtService.sign(
      { sessionId, _id: user._id },
      {
        secret: this.appConfig.USER_JWT_REFRESH_SECRET,
        expiresIn: this.appConfig.USER_JWT_REFRESH_EXPIRY || 7200, // 2 hours
      },
    );

    return {
      refreshToken,
    };
  }
  // Generate Temp Access Token
  generateTempAccessToken(userId: string) {
    const payload: ITempAccessTokenPayload = {
      _id: userId,
      temp: true,
    };

    return this.jwtService.sign(payload, {
      secret: this.appConfig.USER_JWT_SECRET,
      expiresIn: '10m',
    });
  }
}
