import { Module } from '@nestjs/common';
import { AppConfig, AwsS3Module, AwsSESModule } from '@common';
import { RouterModule } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { RedisModule, RedisModuleOptions } from '@songkeys/nestjs-redis';
import { UserUsersModule } from './modules/user/user-users.module';

@Module({
  imports: [
    // Register all the admins Sub-modules
    UserUsersModule,
    // Route all the admins Sub-modules

    // General Module Imports
    PassportModule.register({ session: false, property: 'persona' }),
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
export class UsersServiceModule {}
