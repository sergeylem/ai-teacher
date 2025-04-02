import { apiClient } from './apiClient';
import { ApiAskResponse, AppMode } from '../models/types';

export const teacherApi = {
  async askQuestion(question: string, mode: AppMode): Promise<ApiAskResponse> {
    return apiClient.post<ApiAskResponse>('ask', { question, mode });
  },
};