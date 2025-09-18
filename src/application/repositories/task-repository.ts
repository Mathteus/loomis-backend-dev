import { ITask, TaskEntity, taskState } from '../entities/task';

export interface ITaskUpdateProps {
  taskName?: string;
  description?: string;
  clientId?: string;
  collaboratorId?: string;
  toDate?: Date;
}

export interface ITaskUpdate {
  taskId: string;
  toUpdate: Partial<ITaskUpdateProps>;
}

export interface ITaskUpdateStatus {
  taskId: string;
  status: taskState;
}

export abstract class TaskRepository {
  abstract createTask(task: TaskEntity): Promise<TaskEntity[]>;
  abstract getTasksByAccount(accountId: string): Promise<TaskEntity[]>;
  abstract getTaskById(taskId: string): Promise<TaskEntity>;
  abstract updateTask(task: ITaskUpdate): Promise<TaskEntity[]>;
  abstract deleteTask(taskId: string): Promise<TaskEntity[]>;
  abstract updateTasksStatus(task: ITaskUpdateStatus): Promise<TaskEntity[]>;
}
