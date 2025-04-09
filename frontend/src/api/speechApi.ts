import { apiClient } from './apiClient';
import { ApiWhisperResponse } from '../models/types';
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/speak`;

export const speechApi = {
  async recognizeSpeech(formData: FormData): Promise<ApiWhisperResponse> {
    return apiClient.postFormData<ApiWhisperResponse>('whisper', formData);
  },

  async synthesizeSpeech(text: string): Promise<Blob> {
    const response = await fetch(API_BASE_URL, {
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