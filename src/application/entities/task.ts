import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { Replace } from '@/utility';
import { state } from '@prisma/client';

export class TaskTimeInvalidError extends Error {
  constructor() {
    super('Não é possivel criar uma tarefa com data anterior a data atual!');
  }
}

export class TaskLenghtNameError extends Error {
  constructor() {
    super('Nome da tarefa deve ter no minimo 3 caracteres!');
  }
}

export class TaskLenghtDescriptionError extends Error {
  constructor() {
    super('Nome da tarefa deve ter no minimo 3 caracteres!');
  }
}

export class TaskNotFoundError extends Error {
  constructor() {
    super('Tarefa não encontrada!');
  }
}

export enum taskState {
  pending = 'pending',
  in_progress = 'in_progress',
  completed = 'completed',
}

export interface ITask {
  taskId: string;
  accountId: string;
  taskName: string;
  stateTask: taskState;
  description: string;
  clientId: string;
  collaboratorId: string;
  toDate: Date;
}

export type PrismaTask = {
  taskid: string;
  accountid: string;
  taskname: string;
  statetask: state;
  description: string;
  clientid: string;
  collaboratorid: string;
  to_date: Date;
  created_at: Date;
} | null;

export class TaskEntity {
  private _task: ITask;
  private _identifiers: IdentifiersGeneratorService;

  constructor(
    task: Replace<
      ITask,
      {
        taskId?: string;
        stateTask?: taskState;
      }
    >,
  ) {
    this.verifyDate(task.toDate);
    this.verifyTaskName(task.taskName);
    this.verifyDescription(task.description);
    this._task = {
      taskId: task.taskId ?? this._identifiers.generate('task'),
      accountId: task.accountId,
      taskName: task.taskName,
      stateTask: taskState.pending,
      description: task.description,
      clientId: task.clientId,
      collaboratorId: task.collaboratorId,
      toDate: task.toDate,
    };
  }

  private verifyDate(taskDate: Date) {
    const now = new Date();
    if (taskDate < now) {
      throw new TaskTimeInvalidError();
    }
  }

  private verifyTaskName(name: string) {
    if (name.length < 3) {
      throw new TaskLenghtNameError();
    }
  }

  private verifyDescription(description: string) {
    if (description.length < 3) {
      throw new TaskLenghtDescriptionError();
    }
  }

  public get taskId() {
    return this._task.taskId;
  }

  public get accountId() {
    return this._task.accountId;
  }

  public get taskName() {
    return this._task.taskName;
  }

  public get stateTask() {
    return this._task.stateTask;
  }

  public get description() {
    return this._task.description;
  }

  public get clientId() {
    return this._task.clientId;
  }

  public get collaboratorId() {
    return this._task.collaboratorId;
  }

  public get toDate() {
    return this._task.toDate;
  }

  public getStatePrisma(): state {
    if (this._task.stateTask === taskState.pending) {
      return state.pending;
    }

    if (this._task.stateTask === taskState.in_progress) {
      return state.in_progress;
    }

    return state.completed;
  }
}
