import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@songkeys/nestjs-redis';
import { Redis } from 'ioredis';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidV4, v5 as uuidV5 } from 'uuid';
import { Types } from 'mongoose';
import { AppConfig } from '@common';
import { IUserModel, User } from '@common/schemas/mongoose/user';
import { ITempAccessTokenPayload } from 'src/services/authentication/modules/admin/controllers/admin-auth/interfaces/temp-access-token.interface';

@Injectable()
export class UserBaseAuthService {
  protected readonly redis: Redis;

  constructor(
    protected userModel: IUserModel,
    protected readonly appConfig: AppConfig,
    protected readonly jwtService: JwtService,
    protected readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async handleAdminLoginAndGenerateTokens(userId: string | Types.ObjectId) {
    const user = await this.userModel
      .findById(userId)
      .select({ _id: 1, email: 1, permissions: 1, passwordReset: 1, lastLogin: 1 });

    if (user.lastLogin === null) {
      user.set({ lastLogin: new Date() });
      await user.save();

      user.lastLogin = null;

      return {
        user,
        ...(await this.generateTokens(user)),
      };
    }

    user.set({ lastLogin: new Date() });
    await user.save();

    return {
      user,
      ...(await this.generateTokens(user)),
    };
  }

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

  async createSession(user: HydratedDocument<User>) {
    const session = uuidV5(uuidV4(), uuidV4());

    await this.redis.lpush(user._id?.toString(), session);

    return session;
  }

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

  async generateTokens(user: HydratedDocument<User>) {
    const { accessToken, sessionId: newSessionId } = await this.generateAccessToken(user);

    const { refreshToken } = await this.generateRefreshToken(user, newSessionId);

    return {
      accessToken,
      refreshToken,
    };
  }

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
