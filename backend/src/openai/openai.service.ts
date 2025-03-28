// backend/src/openai/openai.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OpenaiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async askOpenAI(question: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        // { role: 'system', content: 'Ты переводчик с русского на английский. Кратко объясни и переведи.' },
        { role: 'system', content: 'Переводи только c русского на английский. Без пояснений, без примеров.' },
        { role: 'user', content: question },
      ],
    });

    return response.choices[0].message?.content || '';
  }
}
