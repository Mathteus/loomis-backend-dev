import { Controller, Get } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { Public } from '@/decorators/public.decorator';

@Controller('monitor')
export class MonitorController {
  constructor(private memoryMonitor: MonitorService) {}

  @Get('memory')
  @Public()
  getMemoryUsage() {
    return this.memoryMonitor.getCurrentMemoryUsage();
  }
}
