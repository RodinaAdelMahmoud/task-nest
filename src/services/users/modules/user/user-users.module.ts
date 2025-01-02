import { AppConfig, AwsS3Module, AwsSESModule } from '@common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { RouterModule } from '@nestjs/core';
import { Redis } from 'ioredis';
import { RedisModule, RedisModuleOptions, RedisService } from '@songkeys/nestjs-redis';
import { UserMongooseModule } from '@common/modules/mongoose/user';

import { UserProfilesController } from './controllers/users-profile/user-profile.controller';
import { UserProfilesService } from './controllers/users-profile/user-profile.service';

@Module({
  imports: [PassportModule.register({ session: false, property: 'persona' }), UserMongooseModule],
  controllers: [UserProfilesController],
  providers: [UserProfilesService],
})
export class UserUsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(transformRequestEmails).forRoutes(AdminAuthController);
  }
}
