import { FactoryProvider, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongooseCommonModule } from '../common';
import { userSchemaFactory, UserHelperService } from '@common/schemas/mongoose/user';
import { ModelNames } from '@common';

const UserMongooseDynamicModule: FactoryProvider = {
  provide: ModelNames.USER,
  inject: [getConnectionToken(), EventEmitter2],
  useFactory: userSchemaFactory,
};

const userProviders = [UserMongooseDynamicModule, UserHelperService];

@Module({
  imports: [MongooseCommonModule.forRoot()],
  providers: userProviders,
  exports: userProviders,
})
export class UserMongooseModule {}
