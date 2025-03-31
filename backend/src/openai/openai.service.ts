// backend/src/openai/openai.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OpenaiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async askOpenAI(question: string, mode: string): Promise<string> {
    let systemPrompt = '';
  
    switch (mode) {
      case 'translate':
        systemPrompt = 'You are a translator. Translate only from Russian to English. Do not provide explanations or examples. Only return the translation.';
        break;
      case 'teacher-en':
        systemPrompt = 'You are an English teacher. Answer shortly and clearly in English. Speak as if talking to a student. Do not explain too much.';
        break;
      default:
        systemPrompt = 'You are an English assistant.';
    }
  
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });
  
    return response.choices[0].message?.content || '';
  }
  }
