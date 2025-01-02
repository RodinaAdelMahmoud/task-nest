import { Admin, AppConfig, IAdminModel } from '@common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidV4, v5 as uuidV5 } from 'uuid';

@Injectable()
export class BaseAuthService {
  protected readonly redis: Redis;

  constructor(
    protected adminModel: IAdminModel,
    protected readonly appConfig: AppConfig,
    protected readonly jwtService: JwtService,
    protected readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }
  async generateAccessToken(admin: HydratedDocument<Admin>, existingSessionId?: string) {
    const adminId = admin._id;

    let sessionId = existingSessionId;
    // Generate new session id and save it to redis
    if (!existingSessionId) sessionId = await this.createSession(admin);

    const token = this.jwtService.sign(
      {
        _id: adminId,
        name: admin.name,
        email: admin.email,
        permissions: admin.role.permissions,
        sessionId,
      },
      {
        secret: this.appConfig.ADMIN_JWT_SECRET,
        expiresIn: this.appConfig.ADMIN_JWT_EXPIRY,
      },
    );

    return {
      accessToken: token,
      sessionId: sessionId,
    };
  }

  async createSession(admin: HydratedDocument<Admin>) {
    const session = uuidV5(uuidV4(), uuidV4());

    await this.redis.lpush(admin._id?.toString(), session);

    return session;
  }

  async generateRefreshToken(admin: HydratedDocument<Admin>, sessionId: string, rememberMe = false) {
    const refreshToken = this.jwtService.sign(
      { sessionId, _id: admin._id },
      {
        secret: this.appConfig.ADMIN_JWT_REFRESH_SECRET,
        expiresIn: rememberMe ? this.appConfig.ADMIN_JWT_REFRESH_EXPIRY : 7200, // 2 hours
      },
    );

    return {
      refreshToken,
    };
  }

  async generateTokens(admin: HydratedDocument<Admin>, rememberMe = false) {
    const { accessToken, sessionId: newSessionId } = await this.generateAccessToken(admin);

    const { refreshToken } = await this.generateRefreshToken(admin, newSessionId, rememberMe);

    return {
      accessToken,
      refreshToken,
    };
  }
}
