import { Persona, EmployeeJwtPersona, CustomResponse } from '@common';
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { EmployeeJwtDecodeGuard } from 'src/services/authentication/modules/employee/controllers';
import { UpdateTaskStatusDto } from '../../dto/employee/change-task-status.dto';
import { CreateTaskDto } from '../../dto/employee/create-task.dto';
import { ListTasksQueryDto } from '../../dto/employee/list-my-tasks.dto';
import { UpdateTaskDto } from '../../dto/employee/update-task.dto';
import { EmployeeTasksService } from './task.service';

@Controller('tasks')
@ApiTags('Task - Employee')
export class EmployeeTasksController {
  constructor(private employeeTasksService: EmployeeTasksService) {}

  //   @ApiBearerAuth()
  //   @ApiOperation({ summary: 'create a new task' })
  //   @UseGuards(EmployeeJwtDecodeGuard)
  //   @Post('employee/private/tasks')
  //   async createNewAssignedTask(@Persona() employeeJwt: EmployeeJwtPersona, @Body() body: CreateTaskDto) {
  //     const result = await this.employeeTasksService.createNewAssignedTask(employeeJwt._id, body);

  //     return new CustomResponse().success({
  //       payload: { data: result },
  //     });
  //   }

  //   @ApiBearerAuth()
  //   @ApiOperation({ summary: 'paginate tasks' })
  //   @UseGuards(EmployeeJwtDecodeGuard)
  //   @Get('employee/private/tasks')
  //   async paginateTasks(@Persona() employeeJwt: EmployeeJwtPersona, @Query() query: ListTasksQueryDto) {
  //     const result = await this.employeeTasksService.paginateTasks(employeeJwt._id, query);

  //     return new CustomResponse().success({
  //       payload: result,
  //     });
  //   }

  //   @ApiBearerAuth()
  //   @ApiOperation({ summary: 'get task by taskId' })
  //   @UseGuards(EmployeeJwtDecodeGuard)
  //   @Get('employee/private/tasks/:id')
  //   async getTaskByTaskId(@Persona() employeeJwt: EmployeeJwtPersona, @Param('id') param: string) {
  //     const result = await this.employeeTasksService.getTaskByTaskId(employeeJwt._id, param);

  //     return new CustomResponse().success({
  //       payload: { data: result },
  //     });
  //   }

  //   @ApiBearerAuth()
  //   @ApiOperation({ summary: 'update task issued by me' })
  //   @UseGuards(EmployeeJwtDecodeGuard)
  //   @Patch('employee/private/tasks/:id')
  //   async updateSelfTask(
  //     @Persona() employeeJwt: EmployeeJwtPersona,
  //     @Param('id') param: string,
  //     @Body() body: UpdateTaskDto,
  //   ) {
  //     const result = await this.employeeTasksService.updateSelfTask(employeeJwt._id, param, body);

  //     return new CustomResponse().success({
  //       payload: { data: result },
  //     });
  //   }

  //   @ApiBearerAuth()
  //   @ApiOperation({ summary: 'update task status' })
  //   @UseGuards(EmployeeJwtDecodeGuard)
  //   @Patch('employee/private/tasks/:id/status')
  //   async updateTaskStatus(
  //     @Persona() employeeJwt: EmployeeJwtPersona,
  //     @Param('id') param: string,
  //     @Body() body: UpdateTaskStatusDto,
  //   ) {
  //     const result = await this.employeeTasksService.updateTaskStatus(employeeJwt._id, param, body);

  //     return new CustomResponse().success({
  //       payload: { data: result },
  //     });
  //   }
}
