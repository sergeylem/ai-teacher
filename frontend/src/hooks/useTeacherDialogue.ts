import { useCallback, useState } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';

export const useTeacherDialogue = () => {
  const { speak, isSpeaking } = useSpeechSynthesis();
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const teacherSay = useCallback(
    async (text: string, skipSpeak = false, onSaid?: () => void) => {
      if (!skipSpeak) {
        // await wait(500); Pause
        await speak(text);
      }
      if (onSaid) onSaid();
    },
    [speak]
  );

  const sayWelcomeIfNeeded = async (callback: (text: string) => void) => {
    if (!hasWelcomed) {
      setHasWelcomed(true);
      const welcome = "Hi! How are you? Let's get to know each other. My name is Ellie. What's your name?";
      callback(welcome);
      await teacherSay(welcome, false);
    }
  };

  return {
    teacherSay,
    sayWelcomeIfNeeded,
    isSpeaking,
  };
};
