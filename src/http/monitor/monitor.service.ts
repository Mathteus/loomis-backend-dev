import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class MonitorService implements OnModuleInit {
  private readonly logger = new Logger(MonitorService.name);
  private monitoringInterval: NodeJS.Timeout;

  onModuleInit() {
    this.startMemoryMonitoring();
  }

  OnModuleDestroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
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
    this.logger.debug(JSON.stringify(this.formatMemoryUsage(memoryUsage)));
  }

  private formatMemoryUsage(memoryUsage: NodeJS.MemoryUsage) {
    return {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      arrayBuffers: `${Math.round(memoryUsage.arrayBuffers / 1024 / 1024)}MB`,
      timestamp: new Date().toISOString(),
    };
  }

  getCurrentMemoryUsage() {
    return this.formatMemoryUsage(process.memoryUsage());
  }
}
