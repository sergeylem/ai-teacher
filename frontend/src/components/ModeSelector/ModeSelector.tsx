import React from 'react';
import { AppMode } from '../../models/types';
import styles from './ModeSelector.module.css';

interface ModeSelectorProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange }) => {
  return (
    <div className={styles.container}>
      <select
        value={mode}
        onChange={(e) => onChange(e.target.value as AppMode)}
        className={styles.select}
      >
        <option value="translate">Translate RU → EN</option>
        <option value="speech-correction">Speech Correction — only English</option>
        <option value="level-assessment">Level Assessment</option>
      </select>
    </div>
  );
};