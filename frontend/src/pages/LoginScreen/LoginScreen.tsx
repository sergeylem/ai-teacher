// src/pages/LoginScreen.tsx
import React from 'react';
import styles from './LoginScreen.module.css';

const GOOGLE_AUTH_URL = 'http://localhost:3001/api/auth/google'; // TODO: change to prod

export const LoginScreen: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to AI English Assistant</h1>
      <p className={styles.description}>Please log in with your Google account to begin your level assessment.</p>
      <a href={GOOGLE_AUTH_URL}>
        <button className={styles.loginButton}>🔐 Login with Google</button>
      </a>
    </div>
  );
};
