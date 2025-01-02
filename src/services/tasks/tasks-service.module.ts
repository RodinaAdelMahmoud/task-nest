import { Module } from '@nestjs/common';
import { EmployeeTasksModule } from './modules/employee/employee-tasks.module';

@Module({
  imports: [EmployeeTasksModule],
  controllers: [],
  providers: [],
})
export class TasksServiceModule {}
