import { CustomError } from '@common/classes/custom-error.class';
import { JWT_GUARD_METADATA_KEY, ModelNames } from '@common/constants';
import { EnvironmentEnum, ErrorType } from '@common/enums';
import { PersonaTypeEnum } from '@common/interfaces/jwt-persona/base-jwt-persona.interface';
import { AppConfig } from '@common/modules/env-config/services/app-config';
import { IAdminModel } from '@common/schemas/mongoose/admin/admin.type';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { isEnum } from 'class-validator';
import Redis from 'ioredis';

@Injectable()
export class JwtVerifyGuard implements CanActivate {
  private readonly redis: Redis;
  constructor(
    @Inject(ModelNames.ADMIN) private readonly adminModel: IAdminModel,
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
    const url = request.url;

    let hasUrl = false;
    let isAdmin = false;

    if (typeof url === 'string') {
      const callingContext = url.split('/')[2];
      callingContext === 'admin' ? (isAdmin = true) : (isAdmin = false);
      hasUrl = true;
    }

    const req = context.switchToHttp().getRequest();

    const token = req?.headers?.authorization?.split(' ')[1];

    if (token) {
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

      //const isAdmin = decoded.type === PersonaTypeEnum.ADMIN;

      try {
        if (this.appConfig.NODE_ENV !== EnvironmentEnum.LOCAL) {
          this.jwtService.verify(token, {
            secret: isAdmin ? this.appConfig.ADMIN_JWT_SECRET : this.appConfig.USER_JWT_SECRET,
          });
        }

        if (
          !hasUrl ||
          (isAdmin && decoded.type !== PersonaTypeEnum.ADMIN) ||
          (!isAdmin && decoded.type !== PersonaTypeEnum.USER)
        ) {
          throw new Error();
        }

        req.persona = decoded;
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

      const [sessions, entity] = await Promise.all([
        this.redis.lrange(req.persona._id, 0, -1),
        isAdmin ? this.adminModel.findById(req.persona._id).lean() : '',
      ]);

      if (!sessions?.length || !sessions?.includes(req.persona.sessionId) || !entity) {
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
    }

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
}
