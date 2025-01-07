import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Persona } from '@common';
import { CreateTaskDto } from '../../dto/user/create-task.dto';
import { ListTasksQueryDto } from '../../dto/user/list-my-tasks.dto';
import { UpdateTaskDto } from '../../dto/user/update-task.dto';
import { UserTasksService } from './task.service';
import { CustomResponse } from '@common';

@Controller('tasks')
@ApiTags('Task - User')
export class UserTasksController {
  constructor(private userTasksService: UserTasksService) {}

  // Create a new task for the user
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new task for the user' })
  @Post('user/private/tasks')
  async createNewTask(@Persona() userJwt: any, @Body() body: CreateTaskDto) {
    const result = await this.userTasksService.createNewTask(userJwt._id, body);

    return new CustomResponse().success({
      payload: { data: result },
    });
  }

  // Paginate tasks for the user
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Paginate tasks for the user' })
  @Get('user/private/tasks')
  async paginateTasks(@Persona() userJwt: any, @Query() query: ListTasksQueryDto) {
    const result = await this.userTasksService.paginateTasks(userJwt._id, query);

    return new CustomResponse().success({
      payload: result,
    });
  }

  // Update a task by its ID for the user
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a task by its ID for the user' })
  @Patch('user/private/tasks/:id')
  async updateTask(@Persona() userJwt: any, @Param('id') param: string, @Body() body: UpdateTaskDto) {
    const result = await this.userTasksService.updateTask(userJwt._id, param, body);

    return new CustomResponse().success({
      payload: { data: result },
    });
  }

  // Delete a task by its ID for the user
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a task by its ID for the user' })
  @Patch('user/private/tasks/delete/:id')
  async deleteTask(@Persona() userJwt: any, @Param('id') param: string) {
    const result = await this.userTasksService.deleteTask(param);

    return new CustomResponse().success({
      payload: { data: result },
    });
  }
}
