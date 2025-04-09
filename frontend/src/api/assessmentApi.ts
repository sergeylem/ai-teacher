// src/api/assessmentApi.ts
import { apiClient } from './apiClient';

export const assessmentApi = {
  start: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return apiClient.post<{ assessmentId: string }>('assessment/start', {
      userId: user?.id,
    });
  },

  addEntry: (entry: {
    assessmentId: string;
    question: string;
    transcription: string;
  }) => apiClient.post('assessment/entry', entry),

  complete: (assessmentId: string) =>
    apiClient.post<{ finalLevel: string; summary: string }>('assessment/complete', {
      assessmentId,
    }),
};
