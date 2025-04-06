import * as stream from 'stream/promises';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { Express } from 'express'; 
import { getPrompt } from '../prompts'; 

dotenv.config();

@Injectable()
export class OpenaiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async askOpenAI(question: string, mode: string): Promise<string> {
    const systemPrompt = getPrompt(mode) || 'You are an English assistant.';

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // 'gpt-4'
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    return response.choices[0].message?.content || '';
  }

  async speakText(text: string): Promise<Buffer> {
    const speech = await this.openai.audio.speech.create({
      model: 'tts-1',
      voice: 'shimmer', // variants: alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });
  
    const buffer = Buffer.from(await speech.arrayBuffer());
    return buffer;
  }

  async transcribeAudio(file: Express.Multer.File, mode: string): Promise<string> {
    const filePath = path.resolve(file.path); // path to the saved file
    const language = mode === 'level-assessment' || mode === 'speech-correction' ? 'en' : 'ru';
        
    const response = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text',
      language,
      temperature: 0, // To check
    });
  
    // Clean file after using
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });
  
    return response as string;
  }

  async evaluateResponse(transcription: string) {
    const prompt = getPrompt('user-assessment', { transcription });

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4', // или gpt-3.5-turbo
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });
  
    try {
      const json = JSON.parse(completion.choices[0].message?.content || '{}');
      console.log(`evaluateResponse: ${completion}`);
      return json;
    } catch (err) {
      console.error('Failed to parse OpenAI response:', err);
      throw new Error('AI response parsing failed');
    }
  }
  
}
