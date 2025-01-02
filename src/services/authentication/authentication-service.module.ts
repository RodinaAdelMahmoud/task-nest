import { Module } from '@nestjs/common';
import { AppConfig, AwsS3Module, AwsSESModule } from '@common';
import { RouterModule } from '@nestjs/core';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { AdminAuthenticationModule, UserAuthenticationModule } from './modules';

@Module({
  imports: [
    // Register all the authentication Sub-modules
    AdminAuthenticationModule,

    UserAuthenticationModule,

    // Route all the authentication Sub-modules
    RouterModule.register([{ path: 'authentication/admin', module: AdminAuthenticationModule }]),
    // RouterModule.register([{ path: 'authentication/employee', module: EmployeeAuthenticationModule }]),
    RouterModule.register([{ path: 'authentication/user', module: UserAuthenticationModule }]),

    // General Module Imports
    AwsSESModule.registerAsync({
      useFactory: (appConfig: AppConfig) => ({
        accessKeyId: appConfig.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: appConfig.AWS_SES_SECRET_ACCESS_KEY,
        region: appConfig.AWS_SES_REGION,
      }),
      inject: [AppConfig],
    }),
    AwsS3Module.registerAsync({
      useFactory: (appConfig: AppConfig) => ({
        accessKeyId: appConfig.AWS_UPLOAD_ACCESS_KEY_ID,
        secretAccessKey: appConfig.AWS_UPLOAD_SECRET_ACCESS_KEY,
        region: appConfig.AWS_UPLOAD_REGION,
      }),
      inject: [AppConfig],
    }),
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
  ],
  controllers: [],
  providers: [],
})
export class AuthenticationServiceModule {}
