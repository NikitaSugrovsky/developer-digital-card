import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = Number(config.get<string>('PORT') ?? 3000);

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
}

void bootstrap();