// src/api/assessmentApi.ts
import { apiClient } from './apiClient';

export const assessmentApi = {
  start: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return apiClient.post<{ assessmentId: string }>('api/assessment/start', {
      userId: user?.id,
    });
  },

  addEntry: (entry: {
    assessmentId: string;
    question: string;
    transcription: string;
  }) => apiClient.post('api/assessment/entry', entry),

  complete: (assessmentId: string) =>
    apiClient.post<{ finalLevel: string; summary: string }>('api/assessment/complete', {
      assessmentId,
    }),
};
