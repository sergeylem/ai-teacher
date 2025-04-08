// components/Auth/LoginButton.tsx
import React from 'react';

const GOOGLE_AUTH_URL = 'http://localhost:3001/auth/google'; // TODO change on prod

export const LoginButton: React.FC = () => {
  return (
    <a href={GOOGLE_AUTH_URL}>
      <button>🔐 Login with Google</button>
    </a>
  );
};
