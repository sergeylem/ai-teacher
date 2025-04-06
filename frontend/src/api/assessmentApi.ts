// src/api/assessmentApi.ts
import { apiClient } from './apiClient';

export const assessmentApi = {
    start: (userId: string) =>
      apiClient.post<{ assessmentId: string }>('assessment/start', { userId }),
  
    addEntry: (entry: {
      assessmentId: string;
      question: string;
      transcription: string;
    }) =>
      apiClient.post('assessment/entry', entry),
  
    complete: (assessmentId: string) =>
      apiClient.post<{ finalLevel: string; summary: string }>('assessment/complete', { assessmentId }),
  };
  