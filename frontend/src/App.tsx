import React from 'react';
import { MainPage } from './pages/MainPage/MainPage';
import './assets/styles/global.css';

export const App: React.FC = () => {
  return (
    <div className="app">
      <MainPage />
    </div>
  );
};