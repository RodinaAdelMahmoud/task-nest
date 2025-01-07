import { Module } from '@nestjs/common';
import { UserTasksModule } from './modules/user/user-tasks.module';

@Module({
  imports: [UserTasksModule],
  controllers: [],
  providers: [],
})
export class TasksServiceModule {}
