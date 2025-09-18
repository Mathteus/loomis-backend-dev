import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { IdentifiersGeneratorService } from '@/common/identifiers/identifier-generator';
import { NanoidGeneratorService } from '@/common/identifiers/nanoid-generator.service';
import { TaskService } from './task.service';
import { TaskRepository } from '@/application/repositories/task-repository';
import { PrismaTaskRepository } from '@/application/database/prisma-task-repository';

@Module({
  controllers: [TaskController],
  providers: [
    {
      provide: TaskRepository,
      useClass: PrismaTaskRepository,
    },
    {
      provide: IdentifiersGeneratorService,
      useClass: NanoidGeneratorService,
    },
    NanoidGeneratorService,
    TaskService,
    PrismaTaskRepository,
  ],
})
export class TaskModule {}
