import { Env } from '@/infra/env/env';
import { EnvService } from '@/infra/env/env.service';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get<ConfigService<Env, true>>(EnvService);
  const port = envService.get('PORT') || 8080;

  app.enableCors();

  await app.listen(port);
}
bootstrap();
