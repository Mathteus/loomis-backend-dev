import { Module } from '@nestjs/common';
import { MemoryMonitorService } from './monitor.service';

@Module({
  providers: [MemoryMonitorService],
  exports: [MemoryMonitorService],
})
export class MonitorModule {}
