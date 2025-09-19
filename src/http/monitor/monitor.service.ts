import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class MemoryMonitorService implements OnModuleInit {
  private readonly logger = new Logger(MemoryMonitorService.name);
  private monitoringInterval: NodeJS.Timeout;

  onModuleInit() {
    this.startMemoryMonitoring();
  }

  startMemoryMonitoring(intervalMs: number = 30000) {
    this.monitoringInterval = setInterval(() => {
      const memoryUsage = process.memoryUsage();

      this.logMemoryUsage(memoryUsage);

      // Alertar se o uso estiver muito alto
      if (memoryUsage.heapUsed > 500 * 1024 * 1024) {
        // 500MB
        this.logger.warn('ALERTA: Uso de memória elevado!');
      }
    }, intervalMs);
  }

  stopMemoryMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }

  private logMemoryUsage(memoryUsage: NodeJS.MemoryUsage) {
    this.logger.debug(`
      Memória RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)}MB
      Heap Total: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB
      Heap Usada: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB
      Memória Externa: ${Math.round(memoryUsage.external / 1024 / 1024)}MB
      Array Buffers: ${Math.round(memoryUsage.arrayBuffers / 1024 / 1024)}MB
    `);
  }

  getCurrentMemoryUsage() {
    return process.memoryUsage();
  }
}
