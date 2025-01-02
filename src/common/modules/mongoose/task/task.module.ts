import { FactoryProvider, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getConnectionToken } from '@nestjs/mongoose';
import { MongooseCommonModule } from '../common';
import { taskSchemaFactory } from '@common/schemas/mongoose/task';
import { ModelNames } from '@common';

const TaskMongooseDynamicModule: FactoryProvider = {
  provide: ModelNames.TASK,
  inject: [getConnectionToken(), EventEmitter2],
  useFactory: taskSchemaFactory,
};

const taskProviders = [TaskMongooseDynamicModule];

@Module({
  imports: [MongooseCommonModule.forRoot()],
  providers: taskProviders,
  exports: taskProviders,
})
export class TaskMongooseModule {}
