import { Controller, Get } from '@nestjs/common';
import { MemoryMonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private memoryMonitor: MemoryMonitorService) {}

  @Get('memory')
  getMemoryUsage() {
    const memoryUsage = this.memoryMonitor.getCurrentMemoryUsage();

    return {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      arrayBuffers: `${Math.round(memoryUsage.arrayBuffers / 1024 / 1024)}MB`,
      timestamp: new Date().toISOString(),
    };
  }
}
