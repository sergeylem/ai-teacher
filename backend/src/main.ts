import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env

async function bootstrap() {
  // Create folder tmp
  const tmpDir = path.resolve('./tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
    console.log('🗂️  Created tmp directory');
  }

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const isDev = process.env.NODE_ENV !== 'production';
  console.log(`isDev ${isDev}`);

  app.enableCors({
    origin: isDev
      ? ['http://localhost:3000'] // local
      : [process.env.CLIENT_URL || ''],   // prod
    credentials: true,             // allow cookies
  });

  const port = process.env.PORT || 3001; // 3001 bаckend
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
  console.log(`✅ CORS enabled for: ${isDev ? 'localhost:3000' : process.env.CLIENT_URL}`);
}

bootstrap();
