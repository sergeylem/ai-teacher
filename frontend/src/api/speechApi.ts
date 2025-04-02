import { apiClient } from './apiClient';
import { ApiWhisperResponse } from '../models/types';

export const speechApi = {
  async recognizeSpeech(formData: FormData): Promise<ApiWhisperResponse> {
    return apiClient.postFormData<ApiWhisperResponse>('whisper', formData);
  },

  async synthesizeSpeech(text: string): Promise<Blob> {
    const response = await fetch('http://localhost:3001/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Speech synthesis failed');
    }

    return response.blob();
  },
};