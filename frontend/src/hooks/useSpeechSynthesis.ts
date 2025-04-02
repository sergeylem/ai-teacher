import { useState } from 'react';
import { speechApi } from '../api/speechApi';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    
    try {
      const audioBlob = await speechApi.synthesizeSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

  return {
    isSpeaking,
    speak,
  };
};