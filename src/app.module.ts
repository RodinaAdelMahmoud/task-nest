import { AppConfig, CommonModule, EnvironmentEnum } from '@common';
import { Module } from '@nestjs/common';
import { AdminsServiceModule, AuthenticationServiceModule } from './services';
import { TasksServiceModule } from './services/tasks/tasks-service.module';
import { UsersServiceModule } from './services/users/users-service.module';

@Module({
  imports: [
    TasksServiceModule,
    UsersServiceModule,
    AuthenticationServiceModule,
    AdminsServiceModule,

    CommonModule.registerAsync({
      appConfig: {
        appShortName: 'task-backend',
      },
      useFactory: {
        default: () => ({
          memoryConfig: {
            minHeapSizeInBytes: 512 * 1024 * 1024,
            maxHeapSizeInBytes: 4096 * 1024 * 1024,
          },
        }),
      },
      inject: {
        default: [],
      },
    }),

    // FCMModule.registerAsync({
    //   useFactory: (appConfig: AppConfig) => ({
    //     firebaseEnv: appConfig.NODE_ENV as EnvironmentEnum,
    //   }),
    //   inject: [AppConfig],
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
