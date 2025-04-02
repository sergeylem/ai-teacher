import React from 'react';
import styles from './AudioRecorder.module.css';

interface AudioRecorderProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  isRecording, 
  onStart, 
  onStop
}) => {
  return (
    <div className={styles.container}>
      <button
        onClick={onStart}
        disabled={isRecording}
        className={`${styles.button} ${isRecording ? styles.disabled : ''}`}
      >
        🎙️ Record
      </button>
      <button
        onClick={onStop}
        disabled={!isRecording}
        className={`${styles.button} ${!isRecording ? styles.disabled : ''}`}
      >
        ⏹️ Stop
      </button>
    </div>
  );
};