import React from 'react';
import styles from '../LevelAssessmentWindow/LevelAssessmentWindow.module.css';

interface Props {
  isRecording: boolean;
  isSpeaking: boolean;
  onStart: () => void;
  onStop: () => void;
  showOptions: boolean;
  onContinue: () => void;
  onFinish: () => void;
}

export const AssessmentControls: React.FC<Props> = ({
  isRecording,
  isSpeaking,
  onStart,
  onStop,
  showOptions,
  onContinue,
  onFinish,
}) => (
  <div className={styles.controls}>
    {!isRecording && !isSpeaking ? (
      <button onClick={onStart} className={styles.record}>🎙️ Record</button>
    ) : (
      <button onClick={onStop} className={styles.stop}>⏹️ Stop</button>
    )}

    {showOptions && (
      <div className={styles.options}>
        <button onClick={onContinue}>Continue</button>
        <button onClick={onFinish}>Stop</button>
      </div>
    )}
  </div>
);
