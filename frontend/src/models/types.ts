export type AppMode = 'translate' | 'teacher-en' | 'teacher-en-ru';

export interface ApiAskResponse {
  answer: string;
}

export interface ApiWhisperResponse {
  transcript: string;
}

export interface ParsedOutput {
  mistake: string;
  correct: string;
  explanation: string | null;
}