import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Set global API prefix
  app.setGlobalPrefix('api');

  // Parse JSON and URL-encoded bodies (needed for iyzico callback)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend server is running on: http://localhost:${port}/api`);
}
bootstrap();
