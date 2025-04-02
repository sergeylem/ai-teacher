import React from 'react';
import styles from './VoiceControls.module.css';

interface VoiceControlsProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSubmit: () => void;
  isRecording: boolean;
  isProcessing: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onStartRecording,
  onStopRecording,
  onSubmit,
  isRecording,
}) => {
  return (
    <div className={styles.controlsContainer}>
      {!isRecording ? (
        <button
          onClick={onStartRecording}
          className={styles.controlButton}
          aria-label="Start recording"
        >
          🎙️ Record
        </button>
      ) : (
        <button
          onClick={onStopRecording}
          className={`${styles.controlButton} ${styles.stopButton}`}
          aria-label="Stop recording"
        >
          ⏹️ Stop
        </button>
      )}
      
      <button
        onClick={onSubmit}
        className={`${styles.controlButton} ${styles.submitButton}`}
        disabled={isRecording}
        aria-label="Submit text"
      >
        Send
      </button>
    </div>
  );
};