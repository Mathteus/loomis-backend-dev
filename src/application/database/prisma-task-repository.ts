import { state, tasks } from '@prisma/client';
import {
  ITask,
  PrismaTask,
  TaskEntity,
  TaskNotFoundError,
  taskState,
} from '../entities/task';
import {
  ITaskUpdate,
  ITaskUpdateStatus,
  TaskRepository,
} from '../repositories/task-repository';
import { PrismaService } from './config/prisma.service';

export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  private convertPrismaToTaskEntity(prismaTask: PrismaTask): TaskEntity {
    if (prismaTask === null || prismaTask === undefined) {
      throw new Error('Task not found');
    }

    return new TaskEntity({
      taskId: prismaTask.taskid,
      accountId: prismaTask.accountid,
      taskName: prismaTask.taskname,
      stateTask: prismaTask.statetask as taskState,
      description: prismaTask.description,
      clientId: prismaTask.clientid,
      collaboratorId: prismaTask.collaboratorid,
      toDate: prismaTask.to_date,
    });
  }

  private crateTaskToUpdate(update: Partial<ITask>): Partial<tasks> {
    const toUpdate: Partial<tasks> = {};

    if (update.taskName) {
      toUpdate.taskname = update.taskName;
    }

    if (update.description) {
      toUpdate.description = update.description;
    }

    if (update.clientId) {
      toUpdate.clientid = update.clientId;
    }

    if (update.collaboratorId) {
      toUpdate.collaboratorid = update.collaboratorId;
    }

    if (update.toDate) {
      toUpdate.to_date = update.toDate;
    }

    return toUpdate;
  }

  async createTask(task: TaskEntity): Promise<TaskEntity[]> {
    await this.prisma.tasks.create({
      data: {
        taskid: task.taskId,
        accountid: task.accountId,
        taskname: task.taskName,
        statetask: task.getStatePrisma(),
        description: task.description,
        clientid: task.clientId,
        collaboratorid: task.collaboratorId,
        to_date: task.toDate,
      },
    });

    return await this.getTasksByAccount(task.accountId);
  }

  async getTasksByAccount(accountId: string): Promise<TaskEntity[]> {
    const tasks = await this.prisma.tasks.findMany({
      where: { accountid: accountId },
      orderBy: { created_at: 'desc' },
    });

    if (!tasks) {
      throw new TaskNotFoundError();
    }

    return tasks.map((task) => {
      return this.convertPrismaToTaskEntity(task);
    });
  }

  async getTaskById(taskId: string): Promise<TaskEntity> {
    const task = await this.prisma.tasks.findUnique({
      where: { taskid: taskId },
    });

    if (!task) {
      throw new TaskNotFoundError();
    }

    return this.convertPrismaToTaskEntity(task);
  }

  async updateTask(task: ITaskUpdate): Promise<TaskEntity[]> {
    const taskUpdate = await this.prisma.tasks.update({
      where: { taskid: task.taskId },
      data: this.crateTaskToUpdate(task.toUpdate),
    });
    if (!taskUpdate) {
      throw new TaskNotFoundError();
    }

    return await this.getTasksByAccount(taskUpdate.accountid);
  }

  async updateTasksStatus(task: ITaskUpdateStatus) {
    const taskUpdate = await this.prisma.tasks.update({
      where: { taskid: task.taskId },
      data: { statetask: task.status as state },
    });
    if (!taskUpdate) {
      throw new TaskNotFoundError();
    }

    return await this.getTasksByAccount(taskUpdate.accountid);
  }

  async deleteTask(taskId: string): Promise<TaskEntity[]> {
    const taskUpdate = await this.prisma.tasks.delete({
      where: { taskid: taskId },
    });
    if (!taskUpdate) {
      throw new TaskNotFoundError();
    }
    return await this.getTasksByAccount(taskUpdate.accountid);
  }
}
