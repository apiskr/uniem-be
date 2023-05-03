import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      // origin: process.env.ORIGIN_URI,
      credentials: true,
    },
  });
  app.use(cookieParser());
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}/`);
}
bootstrap();
