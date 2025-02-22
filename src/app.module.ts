import { CommonModule } from '@common';
import { Module } from '@nestjs/common';
import { AuthenticationServiceModule } from './services';
import { TasksServiceModule } from './services/tasks/tasks-service.module';
import { UsersServiceModule } from './services/users/users-service.module';
import { CategoryModule } from './services/category/category-service.module';
import { AuditLogModule } from './services/audit-log/audit-log-service.module';

@Module({
  imports: [
    TasksServiceModule,
    UsersServiceModule,
    AuthenticationServiceModule,
    CategoryModule,
    AuditLogModule,
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
