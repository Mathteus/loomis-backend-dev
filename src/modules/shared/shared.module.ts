import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/shared/prisma.service';
import { EmailService } from '../../services/shared/email.service';

@Module({
  providers: [PrismaService, EmailService],
  exports: [PrismaService, EmailService],
})
export class SharedModule {}
