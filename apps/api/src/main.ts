import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
  const configuredOrigins = process.env.WEB_ORIGINS
    ? process.env.WEB_ORIGINS.split(',')
    : [process.env.WEB_ORIGIN, ...defaultOrigins];
  const allowedOrigins = [...new Set(configuredOrigins)]
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.API_PORT ?? 3000);
}
void bootstrap();
