import React from 'react';
import { ParsedOutput, AppMode } from '../../models/types';
import styles from './ResponseDisplay.module.css';

interface ResponseDisplayProps {
  output: ParsedOutput;
  mode: AppMode;
  explanationVisible: boolean;
  onShowExplanation: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  output,
  mode,
  explanationVisible,
  onShowExplanation,
  onSpeak,
}) => {
  const handleSpeak = () => {
    const textToSpeak = explanationVisible && output.explanation 
      ? output.explanation 
      : output.correct;
    onSpeak(textToSpeak);
  };

  return (
    <div className={styles.container}>
      <strong>Answer:</strong>
      {output.mistake && <p className={styles.mistake}>{output.mistake}</p>}
      <p className={styles.correct}>{output.correct}</p>
      
      {mode !== 'translate' && !explanationVisible && output.explanation && (
        <button 
          onClick={onShowExplanation}
          className={styles.explanationButton}
        >
          🧠 Explanation
        </button>
      )}
      
      {mode !== 'translate' && explanationVisible && output.explanation && (
        <p className={styles.explanation}>{output.explanation}</p>
      )}
      
      <button 
        onClick={handleSpeak} 
        className={styles.speakButton}
        disabled={!output.correct}
      >
        🔊 Listen
      </button>
    </div>
  );
};