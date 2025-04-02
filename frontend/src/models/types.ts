export type AppMode = 'translate' | 'speech-correction' | 'level-assessment';

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