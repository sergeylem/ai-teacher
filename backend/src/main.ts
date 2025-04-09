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

  app.enableCors({
    origin: (
      isDev
        ? ['http://localhost:3000']
        : [process.env.CLIENT_URL]
    ).filter(Boolean) as (string | RegExp)[],
    credentials: true
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
  console.log(`✅ CORS enabled for: ${isDev ? 'localhost:3000' : process.env.CLIENT_URL}`);
}

bootstrap();
