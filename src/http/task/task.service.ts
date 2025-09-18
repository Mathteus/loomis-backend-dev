import {
  CreateTaskDto,
  TaskUpdateStateDto,
  UpdateTaskDto,
} from '@/application/dto/task';
import {
  TaskEntity,
  TaskNotFoundError,
  TaskTimeInvalidError,
} from '@/application/entities/task';
import { TaskRepository } from '@/application/repositories/task-repository';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(accountId: string, task: CreateTaskDto) {
    try {
      const newTask = new TaskEntity({
        accountId: accountId,
        taskName: task.taskName,
        description: task.description,
        clientId: task.clientId,
        collaboratorId: task.collaboratorId,
        toDate: new Date(task.toDate),
      });
      return await this.taskRepository.createTask(newTask);
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }

      if (err instanceof TaskTimeInvalidError) {
        throw new BadRequestException(err.message);
      }
    }
  }

  async getTasksByAccount(accountId: string) {
    try {
      return await this.taskRepository.getTasksByAccount(accountId);
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }

      if (err instanceof TaskNotFoundError) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async getTaskById(taskId: string) {
    try {
      return await this.taskRepository.getTaskById(taskId);
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }

      if (err instanceof TaskNotFoundError) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async updateTask(taskId: string, task: UpdateTaskDto) {
    try {
      return await this.taskRepository.updateTask({
        taskId,
        toUpdate: {
          taskName: task.taskName,
          description: task.description,
          clientId: task.clientId,
          collaboratorId: task.collaboratorId,
          toDate: new Date(task?.toDate ?? new Date()),
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }

      if (err instanceof TaskNotFoundError) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async updateTasksStatus(taskId: string, task: TaskUpdateStateDto) {
    try {
      return await this.taskRepository.updateTasksStatus({
        taskId,
        status: task.status,
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }

      if (err instanceof TaskNotFoundError) {
        throw new NotFoundException(err.message);
      }
    }
  }

  async deleteTask(taskId: string) {
    try {
      return await this.taskRepository.deleteTask(taskId);
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }

      if (err instanceof TaskNotFoundError) {
        throw new NotFoundException(err.message);
      }
    }
  }
}
