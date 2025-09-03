import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // Serve static files from /uploads
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS for your frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // fallback if not set
    credentials: true,
  });

  const port = process.env.PORT || 4006;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}
bootstrap();
