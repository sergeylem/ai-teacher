// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { OpenaiController } from './openai/openai.controller';
import { OpenaiService } from './openai/openai.service';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class AppModule {}
