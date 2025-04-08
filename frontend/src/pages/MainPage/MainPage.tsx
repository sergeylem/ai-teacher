// MainPage.tsx
import React from 'react';
import { LoginScreen } from '../LoginScreen/LoginScreen';
import { Authenticated } from '../Authenticated/Authenticated';

export const MainPage: React.FC = () => {
  const user = localStorage.getItem('user');
  return user ? <Authenticated /> : <LoginScreen />;
};
