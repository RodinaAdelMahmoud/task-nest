import { AppConfig, AwsS3Module, AwsSESModule } from '@common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserTasksController } from './controllers/task.controller';
import { UserTasksService } from './controllers/task.service';
import { TaskMongooseModule } from '@common/modules/mongoose/task';
import { CategoryMongooseModule } from '@common/modules/mongoose/category';
import { AuditLogMongooseModule } from '@common/modules/mongoose/audit-logs';
// import { TaskEventsListener } from '../shared/config/task-events.listener';
import { AuditLogModule } from 'src/services/audit-log/audit-log-service.module';

@Module({
  imports: [
    TaskMongooseModule,
    CategoryMongooseModule,
    AuditLogMongooseModule,
    AuditLogModule,

    PassportModule.register({ session: false, property: 'user' }),
    AwsS3Module.registerAsync({
      useFactory: (appConfig: AppConfig) => ({
        accessKeyId: appConfig.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: appConfig.AWS_SES_SECRET_ACCESS_KEY,
        region: appConfig.AWS_SES_REGION,
      }),
      inject: [AppConfig],
    }),
    AwsSESModule.registerAsync({
      useFactory: (appConfig: AppConfig) => ({
        accessKeyId: appConfig.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: appConfig.AWS_SES_SECRET_ACCESS_KEY,
        region: appConfig.AWS_SES_REGION,
      }),
      inject: [AppConfig],
    }),
  ],
  controllers: [UserTasksController],
  providers: [UserTasksService],
})
export class UserTasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(transformRequestEmails).forRoutes(AdminAuthController);}
  }
}
