import { AppConfig, AwsS3Module, AwsSESModule } from '@common';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { EmployeeTasksService } from './controllers/task.service';
import { TaskMongooseModule } from '@common/modules/mongoose/task';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TaskMongooseModule,

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
  ],
  // controllers: [EmployeeTasksController],
  providers: [EmployeeTasksService],
})
export class EmployeeTasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(transformRequestEmails).forRoutes(AdminAuthController);
  }
}
