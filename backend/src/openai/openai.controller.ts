import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenaiService } from './openai.service';
import { Express } from 'express'; 
import { diskStorage } from 'multer';

@Controller('api')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('ask')
  async ask(@Body() body: { question: string, mode: string }) {
    const { question, mode } = body;
    const answer = await this.openaiService.askOpenAI(question, mode);
    return { answer };
  }

  @Post('whisper')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './tmp',
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
      },
    }),
  }))
  async transcribe(
    @UploadedFile() file: Express.Multer.File,
    @Body('mode') mode: string,
  ) {
    const transcript = await this.openaiService.transcribeAudio(file, mode);
    return { transcript };
  }
}
