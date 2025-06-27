import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
   app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
  prefix: '/uploads/',
});

  app.enableCors();
    app.enableCors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  });
  await app.listen(process.env.PORT , "0.0.0.0");
  console.log(`Server running on http://localhost:${process.env.PORT || 4006}`);
}
bootstrap();
