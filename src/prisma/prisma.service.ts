import { INestApplication, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Prisma connected to database');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from database');
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    // Prisma 5: событие beforeExit доступно на клиенте, но сигнатуры типов различаются
    // между версиями. Регистрируем аккуратно через process.
    process.on('beforeExit', () => {
      void app.close();
    });
  }
}