import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('api')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('ask')
  async ask(@Body('question') question: string) {
    const answer = await this.openaiService.askOpenAI(question);
    return { answer };
  }
}
