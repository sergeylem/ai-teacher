import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import type { Express } from 'express'; 
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

@Injectable()
export class OpenaiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async askOpenAI(question: string, mode: string): Promise<string> {
    // TODO move to constants
    const prompts: Record<string, string> = {
      translate: 'You are a translator. Translate only from Russian to English. Do not provide explanations or examples. Only return the translation.',
      'teacher-en': 'You are an English teacher. Answer shortly and clearly in English. Speak as if talking to a student. Do not explain too much.',
    };

    const systemPrompt = prompts[mode] || 'You are an English assistant.';

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    return response.choices[0].message?.content || '';
  }

  async transcribeAudio(file: Express.Multer.File): Promise<string> {
    const filePath = path.resolve(file.path); // path to the saved file
  
    const response = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text',
    });
  
    // Clean file after using
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });
  
    return response as string;
  }
}
