import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '@/decorators/curent-user.decorator';
import { IJwtPayload } from '@/common/jwt/jwt.service';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  TaskUpdateStateDto,
  UpdateTaskDto,
} from '@/application/dto/task';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTask(
    @CurrentUser() user: IJwtPayload,
    @Body() contact: CreateTaskDto,
  ) {
    return await this.taskService.createTask(user.sub, contact);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTasksByAccount(@CurrentUser() user: IJwtPayload) {
    return await this.taskService.getTasksByAccount(user.sub);
  }

  @Patch(':taskid')
  @UseGuards(AuthGuard)
  async updateTask(
    @Param('taskid') taskId: string,
    @Body() body: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(taskId, body);
  }

  @Patch(':taskid/status')
  @UseGuards(AuthGuard)
  async updateTaskStatus(
    @Param('taskid') taskId: string,
    @Body() body: TaskUpdateStateDto,
  ) {
    return await this.taskService.updateTasksStatus(taskId, body);
  }

  @Delete(':taskid')
  @UseGuards(AuthGuard)
  async deleteTask(
    @CurrentUser() user: IJwtPayload,
    @Param('taskid') taskId: string,
  ) {
    return await this.taskService.deleteTask(taskId);
  }
}
