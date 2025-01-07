import { FactoryProvider, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongooseCommonModule } from '../common';
import { categorySchemaFactory } from '@common/schemas/mongoose/category';
import { ModelNames } from '@common';

const CategoryMongooseDynamicModule: FactoryProvider = {
  provide: ModelNames.CATEGORY,
  inject: [getConnectionToken(), EventEmitter2],
  useFactory: categorySchemaFactory,
};

const categoryProviders = [CategoryMongooseDynamicModule];

@Module({
  imports: [MongooseCommonModule.forRoot()],
  providers: categoryProviders,
  exports: categoryProviders,
})
export class CategoryMongooseModule {}
