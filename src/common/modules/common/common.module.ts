import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { filterSoftDeletePlugin } from '@common/plugins/soft-delete';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ReadConcernLevel, ReadPreferenceMode } from 'mongodb';
import { Connection } from 'mongoose';
import { HealthController } from './controllers';
import { ExceptionFilter } from './filters';
import { AdminPermissionGuard, ApiVersionGuard, JwtDecodeGuard, JwtVerifyGuard } from './guards';
import { LoggingInterceptor } from './interceptors';
import { CommonModuleAsyncOptions } from './interfaces';
import { createAsyncProviders } from './providers';
import { CustomLoggerService } from './services/logger';
import { configSchema } from '@common/schemas/joi';
import { EnvConfigModule } from '../env-config/env-config.module';
import { AppConfig } from '../env-config/services/app-config';
import { EventListenerErrorHandlerService } from './services/event-listener-handlers';
import { MongoDbHealthService } from './services/health-checks';
import { AdminMongooseModule } from '@common/modules/mongoose/admin/admin.module';

@Module({})
export class CommonModule {
  static registerAsync(options: CommonModuleAsyncOptions): DynamicModule {
    if (!options.useFactory) throw new Error('Missing Configurations for CommonModule: useFactory is required');

    const defaultAppConfigOptions = {
      allowMongooseGlobalPlugins: true,
    };

    const appConfigOptions = {
      ...defaultAppConfigOptions,
      ...options.appConfig,
    };

    const providers = [
      ...createAsyncProviders(options),
      MongoDbHealthService,
      EventListenerErrorHandlerService,
      CustomLoggerService,
      LoggingInterceptor,
    ];

    const imports = [
      ...(options.imports ?? []),
      EnvConfigModule.register(appConfigOptions),
      TerminusModule,
      ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema(options.appConfig) }),
      JwtModule.register({}),
      EventEmitterModule.forRoot(),
      RedisModule.forRootAsync({
        imports: [],
        inject: [AppConfig],
        useFactory: async (appConfig: AppConfig): Promise<RedisModuleOptions> => {
          return {
            config: {
              host: appConfig.REDIS_HOST ?? 'redis',
              port: appConfig.REDIS_PORT,
            },
          };
        },
      }),
      MongooseModule.forRootAsync({
        useFactory: async (appConfig: AppConfig) => {
          return {
            uri: appConfig.MONGODB_URL,
            readPreference: ReadPreferenceMode.primaryPreferred,
            readConcern: { level: ReadConcernLevel.majority },
            writeConcern: { w: 'majority' },
            connectionFactory: (connection: Connection) => {
              if (appConfigOptions.allowMongooseGlobalPlugins) {
                connection.plugin(filterSoftDeletePlugin);
              }

              return connection;
            },
          };
        },
        inject: [AppConfig],
      }),
      AdminMongooseModule,
    ];

    return {
      module: CommonModule,
      imports,
      providers: [
        ...providers,
        {
          provide: APP_FILTER,
          useClass: ExceptionFilter,
        },
        {
          provide: APP_GUARD,
          useClass: ApiVersionGuard,
        },
        // {
        //   provide: APP_GUARD,
        //   useClass: JwtVerifyGuard,
        // },
        {
          provide: APP_GUARD,
          useClass: JwtDecodeGuard,
        },
        {
          provide: APP_GUARD,
          useClass: AdminPermissionGuard,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
      ],
      exports: [...imports, ...providers],
      global: true,
      controllers: [HealthController],
    };
  }
}
