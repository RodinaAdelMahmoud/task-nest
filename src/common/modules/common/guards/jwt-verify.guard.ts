import { CustomError } from '@common/classes/custom-error.class';
import { JWT_GUARD_METADATA_KEY } from '@common/constants';
import { EnvironmentEnum, ErrorType } from '@common/enums';
import { PersonaTypeEnum } from '@common/interfaces/jwt-persona/base-jwt-persona.interface';
import { AppConfig } from '@common/modules/env-config/services/app-config';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { isEnum } from 'class-validator';
import Redis from 'ioredis';

@Injectable()
export class JwtVerifyGuard implements CanActivate {
  private readonly redis: Redis;

  constructor(
    private readonly appConfig: AppConfig,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {
    this.redis = this.redisService.getClient();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noBearer = this.reflector.get<boolean>(JWT_GUARD_METADATA_KEY, context.getHandler());

    if (noBearer) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'No token provided',
            ar: 'لم يتم توفير رمز تحقيق',
          },
          errorType: ErrorType.UNAUTHORIZED,
          event: 'UNAUTHORIZED',
        }),
      );
    }

    try {
      let decoded;

      try {
        decoded = this.jwtService.decode(token);

        if (!decoded?.type || !isEnum(decoded.type, PersonaTypeEnum)) {
          throw new Error();
        }
      } catch (error) {
        throw new UnauthorizedException(
          new CustomError({
            localizedMessage: {
              en: 'Invalid token',
              ar: 'رمز غير صحيح',
            },
            errorType: ErrorType.UNAUTHORIZED,
            event: 'UNAUTHORIZED',
          }),
        );
      }

      if (this.appConfig.NODE_ENV !== EnvironmentEnum.LOCAL) {
        this.jwtService.verify(token, { secret: this.appConfig.USER_JWT_SECRET });
      }

      if (decoded.type !== PersonaTypeEnum.USER) {
        throw new Error();
      }

      request.persona = decoded;

      const sessions = await this.redis.lrange(request.persona._id, 0, -1);

      if (!sessions?.length || !sessions.includes(request.persona.sessionId)) {
        throw new UnauthorizedException(
          new CustomError({
            localizedMessage: {
              en: 'Unauthorized',
              ar: 'غير مصرح به هذا الإجراء',
            },
            errorType: ErrorType.UNAUTHORIZED,
            event: 'UNAUTHORIZED_EXCEPTION',
          }),
        );
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        new CustomError({
          localizedMessage: {
            en: 'Invalid token',
            ar: 'رمز غير صحيح',
          },
          errorType: ErrorType.UNAUTHORIZED,
          event: 'UNAUTHORIZED',
        }),
      );
    }
  }
}
